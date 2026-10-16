const {generateOtp,hashOTP}=require('../utils/otp');
const {publishToQueue} =require("../messageBroker/rabbit");
const { client } = require('../redis/cache.service');
const userModel = require('../model/user.model');

const requestEmailOTP=async(req,res)=>{
    try{
const user =await userModel.findById(req.user.id);
if(user.isEmailVerified){
    return res.status(200).json({
        message:"your email is already verified"
    })
}
const otp=await generateOtp();
await publishToQueue("verify_email",{
    email:user.email,
    otp,
    user
});
return res.status(200).json({
  success: true,
  message: "Verification OTP sent to your email",
  data: {
    expiresIn: 300, // seconds
  },
});
    }catch(err){
        return res.status(500).json({
            message:"internal server error failed to verify mobile no.",
            error:err.message,
        })
    }
}

const requestMobileOtp=async(req,res)=>{
    try{
    const user =await userModel.findById(req.user.id); 
    if(user.isMobileNoVerified){
        return res.status(200).json({
            message:"mobile no is already verified"
        })
    }
    if(!user.mobileNo)return res.status(404).json({
        message:"mobile no not found first add your mobile no"
    })
    if(!user.isEmailVerified){
        return res.status(400).json({
            message:"first verify your email"
        })
    }

const otp=await generateOtp();
await publishToQueue("verify_mobileNo",{
    mobileNo:user.mobileNo,
    otp,
    user
})
return res.status(200).json({
    success:true,
    message:"otp is sent to your mobile no",
    data:{
        expiresIn:300,
    }

})
    }catch(err){

    }
}


const verifyEmailOtp=async(req,res)=>{
    try{
const otp=req.body;
const userId=req.user.id;
if(!otp)return res.status(401).json({
    message:"unauthorized otp is required"
})

const hashedOTP=await hashOTP(otp);

const key=  `otp:email:${userId}`;
const storedHash=await client.get(key);
if(!storedHash)return res.status(400).json({
    message:"otp expired or not found"
})

if(hashedOTP!==storedHash){
    return res.status(400).json({
        message:"invalid otp"
    })
}

const user = await userModel.findByIdAndUpdate(
      userId,
      { isEmailVerified: true },
      { new: true }
    );
    return res.status(200).json({
        message:"email verified successfully",
        user
    })


    }catch(err){
        return res.status(500).json({
            message:"internal server err",
            error:err.message
        })
    }
}
const verifyMobileOtp=async(req,res)=>{
    try{
    const userId=req.user.id;
    const otp=req.body;
if(!otp){
    return res.status(400).json({
        message:"otp is required"
    })
}
const hashedOtp=await hashOTP(otp);
const key=`otp:mobile:${userId}`;
const storedHash=await client.get(key);
if(!storedHash)return res.status(400).json({
    message:"otp is expired or not found"
});

if(hashedOtp!==storedHash){
    return res.status(401).json({
message:"invalid otp"
    })
}

const user=await userModel.findByIdAndUpdate(
    userId,
    {isMobileNoVerified:true},
    {new:true}
);

 return res.status(200).json({
        message:"mobileNo verified successfully",
        user
    })




    }catch(err){
        return res.status(500).json({
            message:"internal server error failed to verify mobileNo"
        })
    }
}



module.exports = { requestEmailOTP, requestMobileOtp, verifyEmailOtp, verifyMobileOtp };
