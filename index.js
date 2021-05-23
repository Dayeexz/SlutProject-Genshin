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

//OBS after this I will mainly write comments in english following Florians advice

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
}));

//tells me if when i start up the server if it fails to connect or not
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

//test user
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

//registration variables
app.post('/register', (req, res) => {
    const email = req.body.email;
    const emailRepeat = req.body['email-repeat'];
    const username = req.body.username;
    const password = req.body.psw;
    const passwordRepeat = req.body['psw-repeat'];

    //Compares the variable with the repeating one to see if it matches
    if(email !== emailRepeat) {
        res.render('login', {errors: ['Email not matching']});
        return;
    }

    if(password !== passwordRepeat) {
        res.render('login', {errors: ['Password not matching']});
        return;
    }

    //Creates a user and gives feedback incase of error
    User.create({
        username,
        password,
        email
    }, (err, user) => {
        if(err || !user) {
            res.render('login', {errors: ['Unable to create user']});
            return;
        }
        //once the user has succesfully registerd they are automatically logged in
        req.session.user = user;
        res.redirect('/home');
    });
});

//renders the login
app.get("/login", (req, res)=> {
    res.render("login")
})

//if you enter the wrong password you get rickrolled (with ads cause youtube)
app.post("/login", (req,res)=>{
    const password = req.body.psw;
    User.findOne({
        username: req.body.usern,
    }, (err, user) => {
        if(err || !user || user.password !== password) {
            return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        }
        //adds a session cookie to the user when they login and redirects them to home
        req.session.user = user;
        res.redirect('/home');
    });
});

//deletes the cookie and logs the user out,
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
    else{console.log("connected");}
})

