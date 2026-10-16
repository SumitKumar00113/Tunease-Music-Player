const jwt = require("jsonwebtoken");
const _config = require("../config/config");

const generateAccessToken = (user, sessionId) => {
    return jwt.sign(
        {
            id: user._id.toString(),
            email: user.email,
            mobileNo: user.mobileNo,
            fullName: user.fullName,
            role: user.role,
            sessionId
        },
        _config.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (user, sessionId) => {
    return jwt.sign(
        {
            id: user._id.toString(),
            sessionId
        },
        _config.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};