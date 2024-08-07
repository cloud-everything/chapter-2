const express= require('express')
const userRouter=express.Router();
const userController=require("../Controller/UserController")


userRouter.post("/login",userController.userLoginController)
userRouter.post("/signup",userController.userSignupController)


module.exports =userRouter