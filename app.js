const mongoose = require("mongoose");
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express();
const proxy = require('express-http-proxy');
const request = require('request');
const jsonParser = express.json();
const User = require('./server/models/user');
const SecretData = require('./server/models/secretData');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(cors({
    origin: true,
}));
app.use(cookieParser());
app.use(express.static('client/webpack_build'));

app.options('*', cors());

// app.use('/api/Account/users', proxy('http://195.2.80.65:5267/api/Account/users'));

// app.use(express.static(__dirname + "./client/webpack_build"));
// app.use(express.static('./'));
// app.use(express.static(__dirname + '/client/public'));
 
mongoose.connect("mongodb://127.0.0.1:27017/usersdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function(err) {
    if(err) return console.log(err);
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.post("/api/SecretData/sharing", jsonParser, function(req, res){
    // fetch('http://195.2.80.65:5267/api/SecretData/sharing', {
    //     method: "POST",
    //     body: req.body,
    // })
    // .then(resp => resp.json())
    // .then(result => res.send(result));
    var newurl = 'http://195.2.80.65:5267/api/SecretData/sharing';
    request(newurl).pipe(res);
});

app.get("/api/Account/users", jsonParser, function(req, res){
    // fetch('http://195.2.80.65:5267/api/Account/users', req)
    // .then(resp => resp.json())
    // .then(result => res.send(result));
    var newurl = 'http://195.2.80.65:5267/api/Account/users';
    request(newurl).pipe(res);
});

app.get('/api/Account/logout', jsonParser, function(req, res){
    res.clearCookie("userId");
    res.send(200);
});

app.post('/api/Account/login', jsonParser, function(req, res){
    const { login, password } = req?.body;
    User.findOne({ login, password }, function(err, user){
        if (user) {
            res.cookie("userId", user._id, {
                httpOnly: true,
                expires: new Date((new Date()).getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
            });
            res.send(user);
        }
        if (!user || err) {
            res.clearCookie("userId");
            res.send(401);
        }
    })
});

app.post('/api/Account/registration', jsonParser, function(req, res){
    console.log(req.body)
    const login = req.body.login;
    const password = req.body.password;
    const user = new User({ login, password });

    user.save(function(err){
        if(err) return console.log(err);
        res.send(user);
    });
});

app.get("/api/Account/users", jsonParser, function(req, res){
    console.log(req.cookies.userId)
    if (req.cookies.userId) {
        User.findOne({ _id: req.cookies.userId }, function(err, user) {
            User.find({}, function(err, users){
                if(err) return console.log(err);
                res.send(users)
            });
            if(err) return console.log(err);
        })
    } else {
        res.send(401);
    }
});

app.post("/api/SecretData/create", jsonParser, function(req, res){
    console.log(req.cookies.userId)
    if (req.cookies.userId) {
        const userId = req.cookies.userId;
        const data = new SecretData({
            userId,
            name: req.body.name,
            fields: req.body.fields,
        });
        data.save(function(err){
            if(err) return console.log(err);
            res.send(data);
        })
    } else {
        res.send(401);
    }
});

app.get("/api/DataType", jsonParser, function(req, res){
    fetch('http://195.2.80.65:5267/api/DataType')
    .then(resp => resp.json())
    .then(result => res.send(result));
});

app.get("/api/SecretData", jsonParser, function(req, res){
    fetch('http://195.2.80.65:5267/api/DataType')
    .then(resp => resp.json())
    .then(res => console.log(res));
    console.log(req.cookies.userId)
    if (req.cookies.userId) {
        const userId = req.cookies.userId;
        SecretData.find({ userId }, function(err, dataItems){
            if(err) return console.log(err);
            res.send(dataItems.map(item => ({
                name: item.name,
                value: item.value,
                fields: item.fields,
                _id: item._id,
            })));
        });
        // if(err) return console.log(err);
    } else {
        res.send(401);
    }
});


app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/client/webpack_build/index.html`);
})
