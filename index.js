//Kallar på express & mongoose, behöver ej ejs
const exp = require("express");
const goose = require("mongoose");
const method = require("method-override");

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

goose.connect("mongodb://localhost:27017/genshin", {useNewUrlParser:true, useUnifiedTopology:true});
const Schema = new goose.Schema({
    usern: String,
    pass: String,
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
})

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
            res.send("Fuck Off")
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

