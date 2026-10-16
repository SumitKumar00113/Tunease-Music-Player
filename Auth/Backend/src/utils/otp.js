const _config=require('../config/config');

const generateOtp=()=>{
    return crypto.randomInt(100000, 1000000).toString();
}
const hashOTP=async(otp)=>{
    return crypto.createHmac("sha256",_config.OTP_SECRET)
    .update(otp)
    .digest("hex");
}
module.exports={generateOtp,hashOTP};
