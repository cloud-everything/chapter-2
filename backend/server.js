const express=require("express")
const app=express()
require("dotenv").config()

const userRoutesMiddleware=require("./Middleware/UserRoutesProtector")
const userRouter=require("./Routes/userRoutes")
const postsRouter=require("./Routes/postRoutes")

app.use(express.json())

app.use("/users", userRouter)

app.use("/posts",userRoutesMiddleware)
app.use("/posts",postsRouter)

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})