const jwt=require("jsonwebtoken")
require("dotenv").config()
const db=require("../models/index")
const userRoutesMiddleware=async(req,res,next)=>{
try{
    const {authorization}=req.headers;
    if(!authorization){
        return res.status(401).json({message:"not authenticated"})
    }
    const token=authorization.split(" ")[1];
    const data=jwt.verify(token,process.env.SECRET_KEY);
    const user=await db.User.findOne({where:{id:data.id}})
    if(!user){
        res.status(401).json({message:"user does not exist"})
    }
    req.user=user.dataValues;
    next();  
}
catch(err){
    res.status(401).json("not a valid token")
}
}

module.exports=userRoutesMiddleware;