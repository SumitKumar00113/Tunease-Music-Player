import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import _config from "../config/config";

export interface AuthUser {
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
  fullName?: string | { firstName?: string; lastName?: string };
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const artistValidate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const accessToken =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    if (!_config.JWT_ACCESS_TOKEN_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        _config.JWT_ACCESS_TOKEN_SECRET_KEY
      ) as AuthUser;

      if (decoded.role !== "artist") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Only artists are allowed.",
        });
      }
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: message,
    });
  }
};

export const userValidate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const accessToken =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    if (!_config.JWT_ACCESS_TOKEN_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        _config.JWT_ACCESS_TOKEN_SECRET_KEY
      ) as AuthUser;
      req.user = decoded;
      return next();
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: message,
    });
  }
};

module.exports = { artistValidate, userValidate };
