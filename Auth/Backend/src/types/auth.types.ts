import { Document } from "mongoose";

export interface IFullName {
  firstName: string;
  lastName?: string;
}

export type UserRole = "user" | "artist" | "admin";
export type AuthProvider = "google" | "local";

export interface IUser extends Document {
  email: string;
  mobileNo?: number | null;
  fullName: IFullName;
  googleId?: string;
  password?: string;
  profilePhoto?: string;
  role: UserRole;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  isMobileNoVerified: boolean;
}

export interface ISafeUser {
  _id: unknown;
  email: string;
  mobileNo?: number | null;
  fullName: IFullName;
  role: UserRole;
  profilePhoto?: string;
}

export interface AuthUserPayload {
  id: string;
  _id?: string;
  email?: string;
  mobileNo?: number | null;
  fullName?: IFullName;
  role?: UserRole;
  sessionId?: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  displayName?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
  provider?: string;
}

declare global {
  namespace Express {
    interface User extends AuthUserPayload {}
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
