import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import _config from "../config/config";
import cacheService from "../redis/cache.service";
import { AuthUserPayload } from "../types/auth.types";

export const accessTokenValidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken =
      (authHeader && typeof authHeader === "string" ? authHeader.split(" ")[1] : null) ||
      (req.cookies ? req.cookies.accessToken : undefined);

    if (!accessToken) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    try {
      const secret: Secret = _config.JWT_ACCESS_TOKEN_SECRET_KEY || _config.JWT_ACCESS_SECRET || "default_access_secret";
      const decoded = jwt.verify(accessToken, secret) as AuthUserPayload;

      // Check if token has been revoked / blacklisted in Redis
      const isBlacklisted = await cacheService.get(`bl:${accessToken}`);
      if (isBlacklisted) {
        res.status(401).json({
          success: false,
          message: "Access token has been revoked",
        });
        return;
      }

      req.user = decoded;
      next();
      return;
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
      return;
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
    return;
  }
};

export const refreshTokenValidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : undefined;

  if (!refreshToken) {
    res.status(401).json({
      message: "Refresh token not found. Please login first.",
    });
    return;
  }

  try {
    const secret: Secret = _config.JWT_REFRESH_TOKEN_SECRET_KEY || _config.JWT_REFRESH_SECRET || "default_refresh_secret";
    const decoded = jwt.verify(refreshToken, secret) as AuthUserPayload;

    req.user = decoded;
    next();
    return;
  } catch (err) {
    const error = err as Error;
    res.status(401).json({
      message: "Unauthorized, invalid refresh token",
      error: error.message,
    });
    return;
  }
};

export default { accessTokenValidate, refreshTokenValidate };
module.exports = { accessTokenValidate, refreshTokenValidate };
