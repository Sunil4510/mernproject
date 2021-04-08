require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//defining the schema of database

const registerSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:[true,"Email Id Already Exists"],
        validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Please Enter A Valid Email ")
                }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[8,"Please Enter A Password At least 8 Characters"]
    },
    confirmPassword:{
            type:String,
            required:true     
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

}) ;

//generating tokens

registerSchema.methods.generateToken = async function(){
    try
    {
    console.log("id="+this._id);
    const token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token});    
    await this.save();
    return token;
    }catch(e){
        res.send("error ocuured"+e);
        console.log("error occured"+e);
    }
}

//converting password into hash

registerSchema.pre("save", async function(next)
{

    if(this.isModified("password"))
    {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    }
    next();
});

//define model

const Register = new mongoose.model("Register",registerSchema);

module.exports = Register;