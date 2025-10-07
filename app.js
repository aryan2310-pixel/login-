const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index');
});

app.post('/create', function(req, res){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(req.body.password, salt, async (err, hashedpassword)=>{
            let createdUser = await userModel.create({
        username : req.body.username,
        password : hashedpassword,
        email : req.body.email,
        age : req.body.age
    });
    let token = jwt.sign({email: req.body.email}, "shhhhhhhhhhh");
    res.cookie('token', token);
        res.redirect('/home');
        });
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', async function(req,res){
    let user = await userModel.findOne({email : req.body.email});
    if(!user) return res.send('something went wrong');

    bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result) {
        let token = jwt.sign({email: user.email}, "shhhhhhhhhhh");
        res.cookie('token', token);  
        res.redirect('/home');
        } else res.send('something went wrong');
    })
})

app.get('/logout', function(req, res){
    res.cookie("token", "");
    res.redirect('/login');
})

app.get('/home', function(req,res){
    res.render('home');
})

app.listen(3000, ()=>{
    console.log('server is running....');
})