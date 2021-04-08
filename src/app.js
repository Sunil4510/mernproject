require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcryptjs")
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/registeration");
const { registerPartial } = require("hbs");

const port = process.env.PORT || 8000

const staticpath = path.join(__dirname,"../public");
const templatepath = path.join(__dirname,"../templates/views");
const partialspath = path.join(__dirname,"../templates/partials");

app.use(express.static(staticpath));
app.use(express.urlencoded({extended:false}));
app.set("view engine", "hbs");
app.set("views",templatepath);
hbs.registerPartials(partialspath);

console.log(process.env.SECRET_KEY);

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})


app.post("/register",async(req,res)=>{

    try {

        const pass = req.body.psw;
        const cpass = req.body.cpsw;

        if(pass===cpass){
        const RegisterEMP = new Register({
            email:req.body.email,
            password:req.body.psw,
            confirmPassword:req.body.cpsw
        })
        
        const token = await RegisterEMP.generateToken();
        console.log("token generated:"+token);



        const created = await RegisterEMP.save();
        console.log("Registerd part:"+created);
        res.status(201).render("index");
    }

    else
    {
        res.send("PASSWORDS ARE NOT MATCHING");
    }

    } catch (e) 
    {
        res.send(e).status(400);
    }
})

app.post("/login",async(req,res)=>{
    try{
    const mail = req.body.email;
    const pass = req.body.psw;

    const usermail = await Register.findOne({email:mail});
        
    const login = await bcrypt.compare(pass,usermail.password);
        console.log(login);

     const token = await usermail.generateToken();
        console.log("token generated:"+token);    

    if(login == true)
    {
        res.status(201).render("index");
    }
    else
    {
        res.send("Invalid Mail And Password");
    }
}catch(e){
res.status(400).send("Invalid Mail And Password");
}
})


app.listen(port,()=>{
    console.log(`Connected to the ${port} port`);
});