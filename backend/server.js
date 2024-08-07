const express=require("express")
const app=express()
require("dotenv").config()

const userRouter=require("./Routes/userRoutes")

app.use(express.json())

app.use("/users", userRouter)
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})