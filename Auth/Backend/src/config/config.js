require("dotenv").config();





const _config={
MONGO_URI:process.env.MONGO_URI,
JWT_REFRESH_TOKEN_SECRET_KEY:process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
JWT_ACCESS_TOKEN_SECRET_KEY:process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
}

module.exports=_config