import jwt, { Secret } from "jsonwebtoken";
import _config from "../config/config";
import { IFullName, UserRole } from "../types/auth.types";

export interface ITokenUser {
  _id?: unknown;
  id?: string;
  email?: string;
  mobileNo?: number | null;
  fullName?: IFullName;
  role?: UserRole;
}

export const generateAccessToken = (user: ITokenUser, sessionId?: string): string => {
  const userId = user._id ? user._id.toString() : (user.id || "");
  const secret: Secret = _config.JWT_ACCESS_SECRET || _config.JWT_ACCESS_TOKEN_SECRET_KEY || "default_access_secret";

  return jwt.sign(
    {
      id: userId,
      email: user.email,
      mobileNo: user.mobileNo,
      fullName: user.fullName,
      role: user.role,
      sessionId,
    },
    secret,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user: ITokenUser, sessionId?: string): string => {
  const userId = user._id ? user._id.toString() : (user.id || "");
  const secret: Secret = _config.JWT_REFRESH_SECRET || _config.JWT_REFRESH_TOKEN_SECRET_KEY || "default_refresh_secret";

  return jwt.sign(
    {
      id: userId,
      sessionId,
    },
    secret,
    { expiresIn: "7d" }
  );
};

export default {
  generateAccessToken,
  generateRefreshToken,
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
