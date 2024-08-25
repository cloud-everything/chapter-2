const db=require("../models/index")
const { S3Client, PutObjectCommand,GetObjectCommand,DeleteObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config()
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const CryptoJS = require("crypto-js");
const sharp = require('sharp');

const S3_ACCESS_KEY=process.env.S3_ACCESS_KEY
const S3_SECRET_ACCESS_KEY=process.env.S3_SECRET_ACCESS_KEY
const S3_BUCKET_NAME=process.env.S3_BUCKET_NAME
const S3_REGION=process.env.S3_REGION

const s3Client = new S3Client({
    region: S3_REGION, 
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
});
  
async function resizeImage(imageBuffer,height,width) {
    try {
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize({width, height,fit:"contain"})
            .toBuffer();
        return resizedImageBuffer;
    } catch (error) {
        throw error;
    }
}

const createAPost=async(req,res)=>
{
    try{
        const random32BitString = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        const resizedImageBuffer = await resizeImage(req.file.buffer,  1920,1080);

        const params = {
            Bucket: S3_BUCKET_NAME, 
            Key: random32BitString, 
            Body: resizedImageBuffer, 
            ContentType: req.file.mimetype, 
          };
          const {caption}=req.body 
          const command = new PutObjectCommand(params);
          const response = await s3Client.send(command);
           if(response.$metadata.httpStatusCode===200){
            const post=await db.Post.create({userId:req.user.id,imagename:random32BitString,caption:caption,likes:0})
            res.status(200).json({message:"create a post"})
           }
           else{
            res.status(400).json({message:"server is down"})
           }
    }
    catch(err){
        res.status(500).json("something went wrong with server response")
    }
}




const getPosts=async(req,res)=>{
try{      
    const allposts=await db.Post.findAll({userId:req.user.id})
    if(allposts.length===0){
    res.status(404).json({message:"no posts not found"});
    return;
    }
    for(let i=0;i<allposts.length;i++){
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: allposts[i].imagename,
        };
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        allposts[i].dataValues.imageurl=url;
    }
    res.status(200).json(allposts)
}
catch(err){
    res.status(500).json("could not get any post due to server error")
}
}





const deleteAPost=async(req,res)=>{
    try{
        console.log(req.user.id,req.params.id)

        const post=await db.Post.findOne({userId:req.user.id,id:req.params.id})
        console.log(post)
        var params = {  Bucket: S3_BUCKET_NAME, Key: post.dataValues.imagename };
        const command=new DeleteObjectCommand(params);
        const response = await s3Client.send(command);
        
        await db.Post.destroy({where:{userId:req.user.id,id:req.params.id}})
        res.status(200).json({message:"post deleted successfully"})

    }
    catch(err){
        res.status(500).json("something went wrong with server response")
    }
}

module.exports={createAPost,getPosts,deleteAPost}