require("dotenv").config();





const _config={
GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
JWT_SECRET:process.env.JWT_SECRET,
CLIENT_URL:process.env.CLIENT_URL || "http://localhost:5173",
NODE_ENV:process.env.NODE_ENV || "development",
REFRESH_TOKEN:process.env.REFRESH_TOKEN,
EMAIL_USER:process.env.EMAIL_USER,
RABBIT_MQ_URL:process.env.RABBIT_MQ_URL
}

module.exports=_config