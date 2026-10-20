const jwt = require("jsonwebtoken");
const _config = require("../config/config");

const generateAccessToken = (user, sessionId) => {
    return jwt.sign(
        {
            id: user._id ? user._id.toString() : (user.id || ""),
            email: user.email,
            mobileNo: user.mobileNo,
            fullName: user.fullName,
            role: user.role,
            sessionId
        },
        // Keep signing aligned with accessTokenValidate and the music service.
        _config.JWT_ACCESS_TOKEN_SECRET_KEY || _config.JWT_ACCESS_SECRET || "default_access_secret",
        { expiresIn: "24h" }
    );
};

const generateRefreshToken = (user, sessionId) => {
    return jwt.sign(
        {
            id: user._id.toString(),
            sessionId
        },
        _config.JWT_REFRESH_TOKEN_SECRET_KEY || _config.JWT_REFRESH_SECRET || "default_refresh_secret",
        { expiresIn: "24h" }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
