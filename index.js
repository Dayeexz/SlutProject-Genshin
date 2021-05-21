//Kallar på express & mongoose, behöver ej ejs
const exp = require("express");
const goose = require("mongoose");
const method = require("method-override");
const dotenv = require('dotenv');
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

        res.redirect('/home');
    });
});

app.get("/login", (req, res)=> {
    res.render("login")
})

app.post("/login", (req,res)=>{
    User.find({
        usern: req.body.usern,
        pass: req.body.psw
    },(err, data)=>{
        if(data.length!=0){
        res.redirect("/home")
        }else{
            res.send(`We're no strangers to love
            You know the rules and so do I
            A full commitment's what I'm thinking of
            You wouldn't get this from any other guy
            I just wanna tell you how I'm feeling
            Gotta make you understand
            Never gonna give you up
            Never gonna let you down
            Never gonna run around and desert you
            Never gonna make you cry
            Never gonna say goodbye
            Never gonna tell a lie and hurt you
            We've known each other for so long
            Your heart's been aching but you're too shy to say it
            Inside we both know what's been going on
            We know the game and we're gonna play it
            And if you ask me how I'm feeling
            Don't tell me you're too blind to see
            Never gonna give you up
            Never gonna let you down
            Never gonna run around and desert you
            Never gonna make you cry
            Never gonna say goodbye
            Never gonna tell a lie and hurt you
            Never gonna give you up
            Never gonna let you down
            Never gonna run around and desert you
            Never gonna make you cry
            Never gonna say goodbye
            Never gonna tell a lie and hurt you
            Never gonna give, never gonna give
            (Give you up)
            We've known each other for so long
            Your heart's been aching but you're too shy to say it
            Inside we both know what's been going on
            We know the game and we're gonna play it
            I just wanna tell you how I'm feeling
            Gotta make you understand
            Never gonna give you up
            Never gonna let you down
            Never gonna run around and desert you
            Never gonna make you cry
            Never gonna say goodbye
            Never gonna tell a lie and hurt you
            Never gonna give you up
            Never gonna let you down
            Never gonna run around and desert you
            Never gonna make you cry
            Never gonna say goodbye
            Never gonna tell a lie and hurt you
            Never gonna give you up
            Never gonna let you down
            Never gonna run around and desert you
            Never gonna make you cry
            Never gonna say goodbye`)
        }
    })
})

app.get("/home", (req, res)=>{
    res.render("home")
})

app.listen(3000, (err) =>{
    if(err){console.log(err)}
    else{console.log("connected)");}
})

