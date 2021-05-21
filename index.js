//Kallar på express & mongoose, behöver ej ejs
const exp = require("express");
const goose = require("mongoose");
const method = require("method-override");
const dotenv = require('dotenv');
const session = require('express-session');

// Loading .env file
const result = dotenv.config();
if(result.error) {
    console.log("[WARNING] Dotenv file wasn't found or unable to load", err);
}

const app = exp();
//gör express till en funktion

app.set("view engine","ejs");
//öppnar filer på rätt sett och tar bort ejs från URL
app.use(exp.urlencoded({extended:true}))
//resources är för css, bilder etc
//views är för html filer
app.use(exp.static("resources"))
//säger att resources mappen finns / del av root
app.use(method('_method'));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
}));

goose.connect(process.env.MONGODB_CONNECTION_STRING, {useNewUrlParser:true, useUnifiedTopology:true}).then(res => {
    console.log("[INFO] MongoDB successfully connected");
}).catch((err) => {
    console.error("[ERROR] MongoDB failed to connect", err);
});

const Schema = new goose.Schema({
    username: String,
    password: String,
    email: String
})
const User = goose.model("user", Schema)

// User.create({
//     usern: "Dayeexz",
//     pass: "12345",
//     email: "taimalundqvits@gmail.com"
// })

app.get("/", (req, res)=>{
    // User.find({}, (err, data)=>{
     //   console.log(data);
     res.redirect("/login")
});

app.post('/register', (req, res) => {
    const email = req.body.email;
    const emailRepeat = req.body['email-repeat'];
    const username = req.body.username;
    const password = req.body.psw;
    const passwordRepeat = req.body['psw-repeat'];


    if(email !== emailRepeat) {
        res.render('login', {errors: ['Email not matching']});
        return;
    }

    if(password !== passwordRepeat) {
        res.render('login', {errors: ['Password not matching']});
        return;
    }

    User.create({
        username,
        password,
        email
    }, (err, user) => {
        if(err || !user) {
            res.render('login', {errors: ['Unable to create user']});
            return;
        }

        req.session.user = user;
        res.redirect('/home');
    });
});

app.get("/login", (req, res)=> {
    res.render("login")
})

app.post("/login", (req,res)=>{
    const password = req.body.psw;
    User.findOne({
        username: req.body.usern,
    }, (err, user) => {
        if(err || !user || user.password !== password) {
            return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        }

        req.session.user = user;
        res.redirect('/home');
    });
});

app.post('/logout', (req, res) => {
    delete req.session.user;

    res.redirect('/login');
});

app.get("/home", (req, res)=>{

    if(!req.session.user) {
        res.redirect('/login');
        return;
    }

    res.render("home")
});

app.listen(3000, (err) =>{
    if(err){console.log(err)}
    else{console.log("connected)");}
})

