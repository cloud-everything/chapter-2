
const validator=require('validator');
const bcrypt=require('bcrypt');
const db=require("../models/index")
const jwt=require("jsonwebtoken")

const createToken=(id)=>{
    const token=jwt.sign({id:id},process.env.SECRET_KEY,{expiresIn:'3d'})
    return token;
}

const userLoginController=async(req,res)=>{

try{
try{
const {email,password}=req.body;
const user=await loginControllerHelper(email,password);
const token=createToken(user.dataValues.id)
res.status(200).json({email:user.dataValues.email,token:token})
}
catch(err){
    
    res.status(400).json({message:err.message});
}
}
catch(err){
    res.status(500).json("something went wrong with server response")

}

}



const userSignupController=async(req,res)=>{
    
try{

    try{

    const {firstname,lastname,email,password}=req.body;
    const hashpassword=await signupControllerHelper(firstname,lastname,email,password);
    const user=await db.User.create({firstname:firstname,lastname:lastname,email:email,password:hashpassword})
    const token=createToken(user.dataValues.id)
    res.status(200).json({email:user.dataValues.email,token:token})
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
    
}
catch(err){
    res.status(500).json("something went wrong with server response")

}
}



const signupControllerHelper=async(firstname,lastname,email,password)=>{
if(!firstname ){
    throw new Error("Firstname is required")
}
if(!lastname){
    throw new Error("Lastname is required")
}
if(!email){
    throw new Error("Email is required")
}
if(!password){
    throw new Error("Password is required")
}
if(!validator.isAlpha(firstname)){
throw new Error("Invalid firstname only alphabets allowed")
}
if(!validator.isAlpha(lastname)){
    throw new Error("Invalid lastname only alphabets allowed")
}

if(!validator.isEmail(email)){
    throw new Error("Invalid email")
}
let user=null;
try{
    user=await db.User.findOne({where:{email:email}})
}
catch(Err){
    throw new Error("something went wrong with database")
}
if(user){
    throw new Error("Email already registered")
}
if(!validator.isStrongPassword(password)){
    throw new Error("Password should be atleast 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character")
}
const salt=await bcrypt.genSalt(10)
const hashpassword=await bcrypt.hash(password,salt)
return hashpassword;
}



const loginControllerHelper=async(email,password)=>{
if(!email || !password){
throw new Error("please enter a valid email and password")
}

let user=null;
try{
    user=await db.User.findOne({where:{email:email}})
}
catch(Err){
    console.log(Err)
    throw new Error("something went wrong with database")
}
if(!user){
throw new Error("Invalid email")
}

const passwordmatch=await bcrypt.compare(password,user.dataValues.password)
if(!passwordmatch){
throw new Error("passsword mismatch")
}
return user;

}


module.exports={userLoginController,userSignupController}