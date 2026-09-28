const userModel=require("../model/user.model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const _config=require("../config/config")


const registerUser=async(req,res)=>{
    try{
const {email,mobileNo,fullName,password}=req.body;
const isUserExist=await userModel.findOne({
    $or:[{email},{mobileNo}]
})
if(isUserExist){
    return res.status(409).json({
        message:'user already exist',
        isUserExist
    })
}
const hashPass=await bcrypt.hash(password,12);
const user=await userModel.create({
    email,
    mobileNo,
    fullName:{
        firstName:fullName.firstName,
        lastName:fullName.lastName
    },
    password:hashPass
})
const accessToken=jwt.sign({id:user._id,email:email,mobileNo:mobileNo,fullName:fullName},_config.JWT_ACCESS_TOKEN_SECRET_KEY,{expiresIn:"2d"})
const refreshToken=jwt.sign({id:user._id},_config.JWT_REFRESH_TOKEN_SECRET_KEY,{expiresIn:"7d"});
res.cookie("accessToken",accessToken)
res.cookie("refreshToken",refreshToken);
return res.status(201).json({
    message:'user registered successfully',
    user
})
    }catch(err){
    return res.status(500).json({
        message:"internal server during register user",
        error:err.message
    })
    }
}

module.exports={registerUser}