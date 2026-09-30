const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const _config = require("../config/config");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/token");
const {publishToQueue}=require("../messageBroker/rabbit");



const setAuthCookies = (res, user) => {
    const isProduction = _config.NODE_ENV === "production";
    res.cookie("accessToken", generateAccessToken(user), {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", generateRefreshToken(user), {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const registerUser = async (req, res) => {
    try {
        const { email, mobileNo, fullName, password } = req.body;
        const isUserExist = await userModel.findOne({
            $or: [{ email }, { mobileNo }]
        });
        if (isUserExist) {
            return res.status(409).json({
                message: 'User already exists',
            });
        }
        const hashPass = await bcrypt.hash(password, 12);
        const user = await userModel.create({
            email,
            mobileNo,
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName
            },
            password: hashPass
        });
        publishToQueue("user-created",{
            id:user._id,
            email:user.email,
            mobileNo:user.mobileNo,
            fullName:user.fullName,
            role:user.role
        })
        setAuthCookies(res, user);
        const safeUser = {
            _id: user._id,
            email: user.email,
            mobileNo: user.mobileNo,
            fullName: user.fullName,
            role: user.role,
            profilePhoto: user.profilePhoto
        };
        return res.status(201).json({
            message: 'User registered successfully',
            user: safeUser
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error during user registration",
            error: err.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, mobileNo, password } = req.body;
        const query = email ? { email } : { mobileNo };
        const isUserExist = await userModel.findOne(query);
        if (!isUserExist) {
            return res.status(404).json({
                message: "User not found, please register your account first"
            });
        }
        const isPassCorrect = await bcrypt.compare(password, isUserExist.password);
        if (!isPassCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        setAuthCookies(res, isUserExist);
        const safeUser = {
            _id: isUserExist._id,
            email: isUserExist.email,
            mobileNo: isUserExist.mobileNo,
            fullName: isUserExist.fullName,
            role: isUserExist.role,
            profilePhoto: isUserExist.profilePhoto
        };
        return res.status(200).json({
            message: "User logged in successfully",
            user: safeUser
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error during login",
            error: err.message
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isProduction = _config.NODE_ENV === "production";
        res.cookie("accessToken", generateAccessToken(user), {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Access token refreshed successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error during logout'
        });
    }
};

const googleAuthCallBack = async (req, res) => {
    try {
        const user = req.user;
        let existingUser = await userModel.findOne({
            $or: [{ email: user.emails[0].value }, { googleId: user.id }]
        });

        if (existingUser) {
            setAuthCookies(res, existingUser);
            return res.redirect(_config.CLIENT_URL);
        }

        const newUser = await userModel.create({
            email: user.emails[0].value,
            googleId: user.id,
            fullName: {
                firstName: user.name?.givenName || user.displayName || "User",
                lastName: user.name?.familyName || ""
            },
            profilePhoto: user.photos[0]?.value,
            authProvider: user.provider || "google"
        });
     publishToQueue("user_created",{
            id:newUser._id,
            email:newUser.email,
             mobileNo: newUser.mobileNo,
            fullName: newUser.fullName,
            role: newUser.role,
        })
        setAuthCookies(res, newUser);
        return res.redirect(_config.CLIENT_URL);
    } catch (err) {
        return res.status(500).json({
            message: "Error during Google OAuth authentication",
            error: err.message
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }
        return res.status(200).json({
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error fetching user profile",
            error: err.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    googleAuthCallBack,
    getUserProfile
};