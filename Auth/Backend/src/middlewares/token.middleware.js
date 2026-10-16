const jwt = require('jsonwebtoken');
const _config = require("../config/config");
const cacheService = require("../redis/cache.service");
const accessTokenValidate = async (req, res, next) => {
    try {
        const accessToken =
            req.headers.authorization?.split(" ")[1] ||
            req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token is required"
            });
        }

        try {
            const decoded = jwt.verify(
                accessToken,
                _config.JWT_ACCESS_TOKEN_SECRET_KEY
            );

            // Check if token has been revoked / blacklisted in Redis
            const isBlacklisted = await cacheService.get(`bl:${accessToken}`);
            if (isBlacklisted) {
                return res.status(401).json({
                    success: false,
                    message: "Access token has been revoked"
                });
            }

            req.user = decoded;
            return next();

        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token"
            });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};
const refreshTokenValidate = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found. Please login first."
        });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            _config.JWT_REFRESH_TOKEN_SECRET_KEY
        );

        req.user = decoded;

        return next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized, invalid refresh token",
            error: err.message
        });
    }
};
module.exports={accessTokenValidate,refreshTokenValidate}
