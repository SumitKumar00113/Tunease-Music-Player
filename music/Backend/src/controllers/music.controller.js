const {uploadFile,getPreSignerUrl}=require("../services/storage.service");
const musicModel=require("../models/music.model");



const uploadMusic=async(req,res)=>{
    const musicFile=req.files?.music?.[0];
    const coverImageFile=req.files?.music?.[0];
try{
const {title,description,genre}=req.body;
const musicKey=await uploadFile(musicFile);
const coverImageKey=await uploadFile(coverImageFile);
const user=res.user;
const music=await musicModel({
 title,
 description,
 artistName:user.fullName.firstName+user.fullName.lastName,
 artistId:user._id,
 album:user._id,
 genre,
musicKey,
coverImageKey,
duration:musicFile.duration,
releaseDate:Date.now(),
playCount:0,
isPublished:true,
isExplicit:false,
createdBy:user._id
})

return res.status(200).json({
    message:"music created",
    music
})
}catch(err){
    return res.status(500).json({
        message:"internal server error",
        error:err,
    })
}
}

const getArtistMusic=async(req,res)=>{
    try{
const musicDocs=await musicModel.findOne({
    id:req.params.id,
}).lean();
for(let music of musicDocs){
    music.musicUrl=await getPreSignerUrl(music.musicKey);
    music.coverImageUrl=await getPreSignerUrl(music.coverImageKey);
    
}
return res.status(200).json({
    message:"artist music fetched",
    music:musicDocs
})              
    }catch(err){    
        return res.status(500).json({
            message:"internal server error",
            error:err,
        })
    }
}
module.exports={
    uploadMusic,
    getArtistMusic
}