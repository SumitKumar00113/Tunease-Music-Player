const {S3Client,PutObjectCommand,GetObjectCommand}=require("@aws-sdk/client-s3")
const _config=require("../config/config");
const {v4:uuid}=require("uuid")
const {getSignedUrl}=require("@aws-sdk/s3-request-presigner")


const s3=new S3Client({
    region:_config.AWS_REGION,
    credentials:{
        accessKeyId:_config.AWS_ACCESS_KEY_ID,
        secretAccessKey:_config.AWS_SECRET_ACCESS_KEY
    }
})


const uploadFile=async(file)=>{
    const key=`${uuid()}-${file.originalName}`
const command=new PutObjectCommand({
Bucket:"amzn-s3-tunease-bucket",
Body:file.buffer,
key:key 
})
const response=await s3.send(command);
return key;
}

const getPreSignerUrl=async(key)=>{
const command=new GetObjectCommand({
    key:key,
    Bucket:"amzn-s3-tunease-bucket"
})
const url=await getSignedUrl(s3,command,{expiresIn:3600})
return url;
}

module.exports={
    uploadFile,
    getPreSignerUrl
}