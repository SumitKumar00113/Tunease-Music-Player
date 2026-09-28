const jwt = require("jsonwebtoken");
const _config = require("../config/config");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            mobileNo: user.mobileNo,
            fullName: user.fullName,
        },
        _config.JWT_ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: "2d",
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },
        _config.JWT_REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
