
const express=require('express');
const postsRouter = express.Router();;
const postController=require("../Controller/PostController")

const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })




postsRouter.get("/:id",postController.getPosts)
postsRouter.post("/",upload.single('image'), postController.createAPost)
postsRouter.delete("/:id",postController.deleteAPost)

module.exports = postsRouter;