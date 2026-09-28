const jwt=require('jsonwebtoken')
const _config=require("../config/config");
const userModel=require("../model/user.model");

const tokenValidate=async(req,res,next)=>{
try{
const accessToken=req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
if(accessToken){
    try{
const decoded=await jwt.verify(accessToken,_config.JWT_ACCESS_TOKEN_SECRET_KEY);
req.user=decoded;
return next()
    }catch(err){
        console.log("Access token failed:", err.message);
    }
}
const refreshToken=req.cookies.refreshToken;
if(!refreshToken){
    return res.status(404).json({
        message:"refresh token not found. You have to login first",
        
    })
}
try{
const decoded=jwt.verify(refreshToken,_config.JWT_REFRESH_TOKEN_SECRET_KEY);
const user=await userModel.findById(decoded.id);
if(!user){
    return res.status(404).json({
        message:"user not found"
    })
}
const newAccessToken=jwt.sign({id:user._id,email:user.email,mobileNo:user.mobileNo,fullName:user.fullName},_config.JWT_ACCESS_TOKEN_SECRET_KEY,{expiresIn:"2d"})
const newRefreshToken=jwt.sign({id:user._id},_config.JWT_REFRESH_TOKEN_SECRET_KEY,{expiresIn:"7d"});
res.cookie("accessToken",newAccessToken)
res.cookie("refreshToken",newRefreshToken);
return next()
}catch(err){
 return res.status(401).json({
    message:"unauthorized, invalid refresh token",
    error:err.message
 })
}
}catch(err){
    return res.status(500).json({
        message:"internal server error",
      error:err.message
    })
}
}

module.exports={tokenValidate}