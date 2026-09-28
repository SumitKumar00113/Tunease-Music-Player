const userModel=require("../model/user.model");
const bcrypt=require("bcrypt")
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/token");

const setAuthCookies = (res, user) => {
    res.cookie("accessToken", generateAccessToken(user), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", generateRefreshToken(user), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const registerUser=async(req,res)=>{
    try{
const {email,mobileNo,fullName,password}=req.body;
const isUserExist=await userModel.findOne({
    $or:[{email},{mobileNo}]
})
if(isUserExist){
    return res.status(409).json({
        message:'user already exist',

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
setAuthCookies(res, user);
const safeUser = { _id: user._id, email: user.email, mobileNo: user.mobileNo, fullName: user.fullName, role: user.role };
return res.status(201).json({
    message:'user registered successfully',
  user:  safeUser
})

    }catch(err){
    return res.status(500).json({
        message:"internal server during register user",
        error:err.message
    })
    }
}
const loginUser=async(req,res)=>{
    try{
const {email,mobileNo,password}=req.body;
const isUserExist=await userModel.findOne({
    $or:[{email},{mobileNo}]
})
if(!isUserExist){
    return res.status(404).json({
        message:"user not found, you have to Register your account first"
    })
}
const isPassCorrect=await bcrypt.compare(password,isUserExist.password)
if(!isPassCorrect){
    return res.status(401).json({
        message:"password is invalid"
    })
}
setAuthCookies(res, isUserExist);
return res.status(200).json({
    message:"user login successfully",
    user:isUserExist

})
    }catch(err){
        return res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const refreshAccessToken=async(req,res)=>{
    try{
        const user=await userModel.findById(req.user.id);
        if(!user){
            return res.status(404).json({
                message:"user not found"
            });
        }

        res.cookie("accessToken",generateAccessToken(user),{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:2*24*60*60*1000
        });

        return res.status(200).json({
            message:"Access token refreshed successfully"
        });
    }catch(err){
        return res.status(500).json({
            message:"internal server error",
            error:err.message
        });
    }
};
const logoutUser=async(req,res)=>{
    try{
res.clearCookie("accessToken");
res.clearCookie("refreshToken");

return res.status(200).json({
    message: "Logged out successfully"
});
    }catch(err){
        return res.status(500).json({
            message:'internal server error'
        })
    }
}

module.exports={registerUser,loginUser,refreshAccessToken,logoutUser}