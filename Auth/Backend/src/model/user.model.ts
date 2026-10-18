import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../types/auth.types";

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: function (this: IUser): boolean {
      return !this.googleId;
    },
  },
  fullName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
  },
  googleId: {
    type: String,
  },
  password: {
    type: String,
    required: function (this: IUser): boolean {
      return !this.googleId;
    },
  },
  profilePhoto: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "artist", "admin"],
    default: "user",
  },
  authProvider: {
    type: String,
    enum: ["google", "local"],
    default: "local",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isMobileNoVerified: {
    type: Boolean,
    default: false,
  },
});

const userModel: Model<IUser> = mongoose.models.user || mongoose.model<IUser>("user", userSchema);

export default userModel;
module.exports = userModel;
