const db=require("../models/index")
const { S3Client, PutObjectCommand,GetObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config()
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const CryptoJS = require("crypto-js");


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
  
const createAPost=async(req,res)=>
{
    try{
        
        const random32BitString = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        console.log(random32BitString)
        const params = {
            Bucket: S3_BUCKET_NAME, // The name of your S3 bucket
            Key: random32BitString, // The key for the object being uploaded (e.g., 'folder/file.txt')
            Body: req.file.buffer, // The content of the object (can be a string, Buffer, or ReadableStream)
            ContentType: req.file.mimetype, // The MIME type of the object being uploaded (optional)
          };

          const command = new PutObjectCommand(params);
          const response = await s3Client.send(command);
           if(response.$metadata.httpStatusCode===200){
            res.status(200).json({message:"create a post"})

           }
           else{
            res.status(400).json({message:"server is down"})

           }
    }
    catch(err){
        console.log(err)
        res.status(500).json("something went wrong with server response")
    }
}



const getPosts=async(req,res)=>{
try{
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: req.body.image,
      };
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(url)
      

      res.status(200).json({message:"ger request succeeded"})
}
catch(err){
    console.log(err)
    res.status(500).json("something went wrong with server response")
}
}


const deleteAPost=async(req,res)=>{
    try{
        res.status(200).json({message:"create a post"})

    }
    catch(err){
        res.status(500).json("something went wrong with server response")
    }
}

module.exports={createAPost,getPosts,deleteAPost}