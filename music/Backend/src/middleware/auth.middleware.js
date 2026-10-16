const jwt = require("jsonwebtoken");
const _config = require("../config/config");


const artistValidate = async (req, res, next) => {
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
            console.log(decoded);
if (decoded.role !== "artist") {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. Only artists are allowed."
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
const userValidate = async (req, res, next) => {
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
               req.user = decoded;
            return next();

        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token"
            });
        }
    }catch(err){
        return res.status(500).json({
            success: false, 
            message: "Internal server error",
            error: err.message
        });     
    }
}


module.exports={artistValidate, userValidate};