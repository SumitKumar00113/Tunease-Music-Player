import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import userModel from "../model/user.model";
import _config from "../config/config";
import cacheService from "../redis/cache.service";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { publishToQueue } from "../messageBroker/rabbit";
import { AuthUserPayload, ISafeUser, IFullName, UserRole } from "../types/auth.types";

interface SessionData {
  userId: string;
  refreshTokenHash: string;
  createdAt: string;
  userAgent?: string;
  ip?: string;
  provider?: string;
}

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  mobileNo?: number | string | null;
  profilePhoto?: string;
  role?: UserRole;
}

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const isProduction = _config.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, mobileNo, fullName, password, role = "user" } = req.body;
    const isUserExist = await userModel.findOne({
      $or: [{ email }, { mobileNo }],
    });
    const sessionId = crypto.randomUUID();

    if (isUserExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashPass = await bcrypt.hash(password, 12);
    const user = await userModel.create({
      email,
      mobileNo,
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName,
      },
      password: hashPass,
      role: (role as UserRole) || "user",
    });

    await publishToQueue("user_created", {
      id: user._id,
      email: user.email,
      mobileNo: user.mobileNo,
      fullName: user.fullName,
      role: user.role,
    });

    const accessToken = generateAccessToken(user, sessionId);
    const refreshToken = generateRefreshToken(user, sessionId);

    // Store session in Redis with 7-day TTL
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const sessionData: SessionData = {
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

    const safeUser: ISafeUser = {
      _id: user._id,
      email: user.email,
      mobileNo: user.mobileNo,
      fullName: user.fullName,
      role: user.role,
      profilePhoto: user.profilePhoto,
    };

    // Cache user profile in Redis with 1 hour TTL
    await cacheService.set(
      `user:profile:${user._id}`,
      safeUser,
      cacheService.EXPIRATION.USER_PROFILE
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "Internal server error during user registration",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, mobileNo, password } = req.body;
    const query = email ? { email } : { mobileNo };
    const isUserExist = await userModel.findOne(query);
    const sessionId = crypto.randomUUID();

    if (!isUserExist || !isUserExist.password) {
      return res.status(404).json({
        message: "User not found, please register your account first",
      });
    }

    const isPassCorrect = await bcrypt.compare(password, isUserExist.password);
    if (!isPassCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const accessToken = generateAccessToken(isUserExist, sessionId);
    const refreshToken = generateRefreshToken(isUserExist, sessionId);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    const sessionData: SessionData = {
      userId: isUserExist._id.toString(),
      refreshTokenHash,
      createdAt: new Date().toISOString(),
      userAgent: req.get("User-Agent") || "Unknown",
      ip: req.ip,
    };

    // Store user session in Redis with 7 days TTL (604800s)
    await cacheService.set(
      `session:${sessionId}`,
      sessionData,
      cacheService.EXPIRATION.USER_SESSION
    );

    setAuthCookies(res, accessToken, refreshToken);

    const safeUser: ISafeUser = {
      _id: isUserExist._id,
      email: isUserExist.email,
      fullName: isUserExist.fullName,
      role: isUserExist.role,
      profilePhoto: isUserExist.profilePhoto,
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
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "Internal server error during login",
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found. Please login first.",
      });
    }

    let decoded: AuthUserPayload;
    try {
      const secret: Secret = _config.JWT_REFRESH_TOKEN_SECRET_KEY || _config.JWT_REFRESH_SECRET || "default_refresh_secret";
      decoded = jwt.verify(refreshToken, secret) as AuthUserPayload;
    } catch {
      return res.status(401).json({
        message: "Unauthorized, invalid refresh token",
      });
    }

    // Validate session in Redis when sessionId is present
    if (decoded.sessionId) {
      const sessionKey = `session:${decoded.sessionId}`;
      const storedSession = (await cacheService.get(sessionKey)) as (SessionData & { userid?: string }) | null;

      if (!storedSession) {
        return res.status(401).json({
          message: "Session expired or revoked. Please log in again.",
        });
      }

      const sessionUserId = storedSession.userId || storedSession.userid;
      if (sessionUserId && sessionUserId.toString() !== decoded.id.toString()) {
        return res.status(401).json({
          message: "Invalid session",
        });
      }

      if (storedSession.refreshTokenHash) {
        const isValidRefreshToken = await bcrypt.compare(refreshToken, storedSession.refreshTokenHash);
        if (!isValidRefreshToken) {
          return res.status(401).json({
            message: "Refresh token has been revoked or is invalid",
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
        message: "User not found",
      });
    }

    const newAccessToken = generateAccessToken(user, decoded.sessionId || crypto.randomUUID());
    const isProduction = _config.NODE_ENV === "production";
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    return res.status(200).json({
      message: "Access token refreshed successfully",
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = req.cookies?.accessToken || (authHeader && typeof authHeader === "string" ? authHeader.split(" ")[1] : null);
    const refreshToken = req.cookies?.refreshToken;

    // Invalidate session in Redis
    if (req.user?.sessionId) {
      await cacheService.del(`session:${req.user.sessionId}`);
    } else if (refreshToken) {
      try {
        const decodedRefresh = jwt.decode(refreshToken) as AuthUserPayload | null;
        if (decodedRefresh?.sessionId) {
          await cacheService.del(`session:${decodedRefresh.sessionId}`);
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Add access token to blacklist cache with 15 mins TTL
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
      message: "Logged out successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error during logout",
    });
  }
};

export const googleAuthCallBack = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const user = req.user as AuthUserPayload;
    if (!user || !user.emails || !user.emails[0]?.value) {
      return res.redirect(`${_config.CLIENT_URL}/login?error=google_auth_failed`);
    }

    const sessionId = crypto.randomUUID();
    const existingUser = await userModel.findOne({
      $or: [{ email: user.emails[0].value }, { googleId: user.id }],
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
          provider: "google",
        },
        cacheService.EXPIRATION.USER_SESSION
      );

      setAuthCookies(res, accessToken, refreshToken);
      return res.redirect(_config.CLIENT_URL);
    }

    const newUser = await userModel.create({
      email: user.emails[0].value,
      googleId: user.id,
      fullName: {
        firstName: user.name?.givenName || user.displayName || "User",
        lastName: user.name?.familyName || "",
      },
      profilePhoto: user.photos && user.photos[0] ? user.photos[0].value : undefined,
      authProvider: (user.provider as "google" | "local") || "google",
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
        provider: "google",
      },
      cacheService.EXPIRATION.USER_SESSION
    );

    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(_config.CLIENT_URL);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "Error during Google OAuth authentication",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const cacheKey = `user:profile:${userId}`;

    // 1. Try cache hit from Redis
    const cachedUser = await cacheService.get(cacheKey);
    if (cachedUser) {
      return res.status(200).json({
        user: cachedUser,
        source: "cache",
      });
    }

    // 2. Cache miss -> query MongoDB
    const user = await userModel.findById(userId).select("-password").lean();
    if (!user) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    // 3. Cache user profile in Redis with 1 hour TTL (3600s)
    await cacheService.set(cacheKey, user, cacheService.EXPIRATION.USER_PROFILE);

    return res.status(200).json({
      user,
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "Internal server error fetching user profile",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { firstName, lastName, mobileNo, profilePhoto, role }: UpdateProfilePayload = req.body;

    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData: {
      fullName?: IFullName;
      mobileNo?: number | null;
      profilePhoto?: string;
      role?: UserRole;
    } = {};

    if (firstName !== undefined || lastName !== undefined) {
      updateData.fullName = {
        firstName: firstName !== undefined ? firstName.trim() : existingUser.fullName?.firstName || "",
        lastName: lastName !== undefined ? lastName.trim() : existingUser.fullName?.lastName || "",
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

    if (role !== undefined && (["user", "artist"] as string[]).includes(role)) {
      updateData.role = role as UserRole;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true })
      .select("-password")
      .lean();

    // Invalidate and update Redis cache for profile with 1 hour TTL
    const cacheKey = `user:profile:${userId}`;
    await cacheService.del(cacheKey);
    if (updatedUser) {
      await cacheService.set(cacheKey, updatedUser, cacheService.EXPIRATION.USER_PROFILE);
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  googleAuthCallBack,
  getUserProfile,
  updateUserProfile,
};
module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  googleAuthCallBack,
  getUserProfile,
  updateUserProfile,
};
