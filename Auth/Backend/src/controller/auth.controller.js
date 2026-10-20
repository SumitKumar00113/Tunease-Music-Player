const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const _config = require("../config/config");
const cacheService = require("../redis/cache.service");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/token");
const { publishToQueue } = require("../messageBroker/rabbit");



const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProduction = _config.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    };
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
};

const registerUser = async (req, res) => {
    try {
        const { email, mobileNo, fullName, password, role = "user" } = req.body;
        const isUserExist = await userModel.findOne({
            $or: [{ email }, { mobileNo }]
        });
        const sessionId = crypto.randomUUID();

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
            password: hashPass,
            role: role || "user",
        });

        await publishToQueue("user_created", {
            id: user._id,
            email: user.email,
            mobileNo: user.mobileNo,
            fullName: user.fullName,
            role: user.role
        });

        const accessToken = generateAccessToken(user, sessionId);
        const refreshToken = generateRefreshToken(user, sessionId);

        // Store the session in Redis for 24 hours.
        const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
        const sessionData = {
            userId: user._id.toString(),
            refreshTokenHash,
            createdAt: new Date().toISOString(),
            userAgent: req.get("User-Agent") || "Unknown",
            ip: req.ip,
        };
        await cacheService.set(
            `session:${sessionId}`,
            sessionData,
            cacheService.EXPIRATION.USER_SESSION
        );

        setAuthCookies(res, accessToken, refreshToken);

        const safeUser = {
            _id: user._id,
            email: user.email,
            mobileNo: user.mobileNo,
            fullName: user.fullName,
            role: user.role,
            profilePhoto: user.profilePhoto
        };

        // Cache user profile in Redis with 1 hour TTL
        await cacheService.set(
            `user:profile:${user._id}`,
            safeUser,
            cacheService.EXPIRATION.USER_PROFILE
        );

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
        const sessionId = crypto.randomUUID();

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

        const accessToken = generateAccessToken(isUserExist, sessionId);
        const refreshToken = generateRefreshToken(isUserExist, sessionId);

        const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
        const sessionData = {
            userId: isUserExist._id.toString(),
            refreshTokenHash,
            createdAt: new Date().toISOString(),
            userAgent: req.get("User-Agent") || "Unknown",
            ip: req.ip,
        };

        // Store the user session in Redis for 24 hours.
        await cacheService.set(
            `session:${sessionId}`,
            sessionData,
            cacheService.EXPIRATION.USER_SESSION
        );

        setAuthCookies(res, accessToken, refreshToken);

        const safeUser = {
            _id: isUserExist._id,
            email: isUserExist.email,
            fullName: isUserExist.fullName,
            role: isUserExist.role,
            profilePhoto: isUserExist.profilePhoto
        };

        // Cache user profile in Redis with 1 hour TTL (3600s)
        await cacheService.set(
            `user:profile:${isUserExist._id}`,
            safeUser,
            cacheService.EXPIRATION.USER_PROFILE
        );

        return res.status(200).json({
            message: "User logged in successfully",
            user: safeUser,
            accessToken
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error during login",
            error: err.message
        });
    }
};

const issueSessionToken = async (req, res) => {
    const user = req.user;
    const userId = user?.id || user?._id?.toString();
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    // Normalize the decoded JWT payload to the same shape as a database user.
    return res.status(200).json({
        accessToken: generateAccessToken({ ...user, _id: userId }, user.sessionId)
    });
};

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found. Please login first."
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                _config.JWT_REFRESH_TOKEN_SECRET_KEY
            );
        } catch (err) {
            return res.status(401).json({
                message: "Unauthorized, invalid refresh token"
            });
        }

        // Validate session in Redis when sessionId is present
        if (decoded.sessionId) {
            const sessionKey = `session:${decoded.sessionId}`;
            const storedSession = await cacheService.get(sessionKey);

            if (!storedSession) {
                return res.status(401).json({
                    message: "Session expired or revoked. Please log in again."
                });
            }

            const sessionUserId = storedSession.userId || storedSession.userid;
            if (sessionUserId && sessionUserId.toString() !== decoded.id.toString()) {
                return res.status(401).json({
                    message: "Invalid session"
                });
            }

            if (storedSession.refreshTokenHash) {
                const isValidRefreshToken = await bcrypt.compare(
                    refreshToken,
                    storedSession.refreshTokenHash
                );
                if (!isValidRefreshToken) {
                    return res.status(401).json({
                        message: "Refresh token has been revoked or is invalid"
                    });
                }
            }
        }

        const user = await userModel.findById(decoded.id);

        if (!user) {
            if (decoded.sessionId) {
                await cacheService.del(`session:${decoded.sessionId}`);
            }
            return res.status(404).json({
                message: "User not found"
            });
        }

        const newAccessToken = generateAccessToken(
            user,
            decoded.sessionId || crypto.randomUUID()
        );
        const isProduction = _config.NODE_ENV === "production";
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
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
        const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        const refreshToken = req.cookies?.refreshToken;

        // Invalidate session in Redis
        if (req.user?.sessionId) {
            await cacheService.del(`session:${req.user.sessionId}`);
        } else if (refreshToken) {
            try {
                const decodedRefresh = jwt.decode(refreshToken);
                if (decodedRefresh?.sessionId) {
                    await cacheService.del(`session:${decodedRefresh.sessionId}`);
                }
            } catch (e) {
                // Ignore parse errors
            }
        }

        // Keep the access token revoked for its full 24-hour lifetime.
        if (accessToken) {
            await cacheService.set(
                `bl:${accessToken}`,
                "revoked",
                cacheService.EXPIRATION.BLACKLIST_TOKEN
            );
        }

        // Clear user profile cache
        if (req.user?.id) {
            await cacheService.del(`user:profile:${req.user.id}`);
        }

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
        let postAuthUrl = _config.CLIENT_URL;
        if (typeof req.query.state === 'string') {
            try {
                const target = new URL(Buffer.from(req.query.state, 'base64url').toString());
                if (target.origin === 'https://tunease-music-service-latest.onrender.com') postAuthUrl = target.href;
            } catch {
                // Ignore malformed state and return to the auth app.
            }
        }
        const user = req.user;
        const sessionId = crypto.randomUUID();
        let existingUser = await userModel.findOne({
            $or: [{ email: user.emails[0].value }, { googleId: user.id }]
        });

        if (existingUser) {
            const accessToken = generateAccessToken(existingUser, sessionId);
            const refreshToken = generateRefreshToken(existingUser, sessionId);

            const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
            await cacheService.set(
                `session:${sessionId}`,
                {
                    userId: existingUser._id.toString(),
                    refreshTokenHash,
                    createdAt: new Date().toISOString(),
                    provider: "google"
                },
                cacheService.EXPIRATION.USER_SESSION
            );

            setAuthCookies(res, accessToken, refreshToken);
            const playerUrl = new URL(postAuthUrl);
            playerUrl.hash = new URLSearchParams({ access_token: accessToken }).toString();
            return res.redirect(playerUrl.toString());
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

        await publishToQueue("user_created", {
            id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
        });

        const accessToken = generateAccessToken(newUser, sessionId);
        const refreshToken = generateRefreshToken(newUser, sessionId);

        const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
        await cacheService.set(
            `session:${sessionId}`,
            {
                userId: newUser._id.toString(),
                refreshTokenHash,
                createdAt: new Date().toISOString(),
                provider: "google"
            },
            cacheService.EXPIRATION.USER_SESSION
        );

        setAuthCookies(res, accessToken, refreshToken);
        const playerUrl = new URL(postAuthUrl);
        playerUrl.hash = new URLSearchParams({ access_token: accessToken }).toString();
        return res.redirect(playerUrl.toString());
    } catch (err) {
        return res.status(500).json({
            message: "Error during Google OAuth authentication",
            error: err.message
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const cacheKey = `user:profile:${userId}`;

        // 1. Try cache hit from Redis
        const cachedUser = await cacheService.get(cacheKey);
        if (cachedUser) {
            return res.status(200).json({
                user: cachedUser,
                source: "cache"
            });
        }

        // 2. Cache miss -> query MongoDB
        const user = await userModel.findById(userId).select("-password").lean();
        if (!user) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }

        // 3. Cache user profile in Redis with 1 hour TTL (3600s)
        await cacheService.set(cacheKey, user, cacheService.EXPIRATION.USER_PROFILE);

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

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { firstName, lastName, mobileNo, profilePhoto, role } = req.body;

        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const updateData = {};

        if (firstName !== undefined || lastName !== undefined) {
            updateData.fullName = {
                firstName: firstName !== undefined ? firstName.trim() : (existingUser.fullName?.firstName || ""),
                lastName: lastName !== undefined ? lastName.trim() : (existingUser.fullName?.lastName || "")
            };
        }

        if (mobileNo !== undefined) {
            const parsedMobile = Number(mobileNo);
            if (mobileNo === null || mobileNo === "") {
                updateData.mobileNo = null;
            } else if (!isNaN(parsedMobile)) {
                updateData.mobileNo = parsedMobile;
            }
        }

        if (profilePhoto !== undefined) {
            updateData.profilePhoto = profilePhoto.trim();
        }

        if (role !== undefined && ["user", "artist"].includes(role)) {
            updateData.role = role;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password").lean();

        // Invalidate and update Redis cache for profile with 1 hour TTL
        const cacheKey = `user:profile:${userId}`;
        await cacheService.del(cacheKey);
        if (updatedUser) {
            await cacheService.set(cacheKey, updatedUser, cacheService.EXPIRATION.USER_PROFILE);
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error updating user profile",
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
    getUserProfile,
    issueSessionToken,
    updateUserProfile
};
