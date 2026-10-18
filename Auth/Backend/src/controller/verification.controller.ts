import { Request, Response } from "express";
import { generateOtp, hashOTP } from "../utils/otp";
import { publishToQueue } from "../messageBroker/rabbit";
import CacheService from "../redis/cache.service";
import userModel from "../model/user.model";

export const requestEmailOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(200).json({
        message: "your email is already verified",
      });
    }
    const otp = await generateOtp();
    await publishToQueue("verify_email", {
      email: user.email,
      otp,
      user,
    });
    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email",
      data: {
        expiresIn: 300, // seconds
      },
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "internal server error failed to verify mobile no.",
      error: error.message,
    });
  }
};

export const requestMobileOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isMobileNoVerified) {
      return res.status(200).json({
        message: "mobile no is already verified",
      });
    }
    if (!user.mobileNo) {
      return res.status(404).json({
        message: "mobile no not found first add your mobile no",
      });
    }
    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "first verify your email",
      });
    }

    const otp = await generateOtp();
    await publishToQueue("verify_mobileNo", {
      mobileNo: user.mobileNo,
      otp,
      user,
    });
    return res.status(200).json({
      success: true,
      message: "otp is sent to your mobile no",
      data: {
        expiresIn: 300,
      },
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "internal server error failed to request mobile otp",
      error: error.message,
    });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const rawOtp: unknown = req.body && typeof req.body === "object" && "otp" in req.body ? req.body.otp : req.body;
    const otpStr = typeof rawOtp === "string" ? rawOtp : typeof rawOtp === "number" ? String(rawOtp) : "";
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!otpStr) {
      return res.status(401).json({
        message: "unauthorized otp is required",
      });
    }

    const hashedOTP = await hashOTP(otpStr);
    const key = `otp:email:${userId}`;
    const storedHash = await CacheService.client.get(key);
    if (!storedHash) {
      return res.status(400).json({
        message: "otp expired or not found",
      });
    }

    if (hashedOTP !== storedHash) {
      return res.status(400).json({
        message: "invalid otp",
      });
    }

    const user = await userModel.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true });
    return res.status(200).json({
      message: "email verified successfully",
      user,
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "internal server err",
      error: error.message,
    });
  }
};

export const verifyMobileOtp = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const rawOtp: unknown = req.body && typeof req.body === "object" && "otp" in req.body ? req.body.otp : req.body;
    const otpStr = typeof rawOtp === "string" ? rawOtp : typeof rawOtp === "number" ? String(rawOtp) : "";

    if (!otpStr) {
      return res.status(400).json({
        message: "otp is required",
      });
    }

    const hashedOtp = await hashOTP(otpStr);
    const key = `otp:mobile:${userId}`;
    const storedHash = await CacheService.client.get(key);
    if (!storedHash) {
      return res.status(400).json({
        message: "otp is expired or not found",
      });
    }

    if (hashedOtp !== storedHash) {
      return res.status(401).json({
        message: "invalid otp",
      });
    }

    const user = await userModel.findByIdAndUpdate(userId, { isMobileNoVerified: true }, { new: true });

    return res.status(200).json({
      message: "mobileNo verified successfully",
      user,
    });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({
      message: "internal server error failed to verify mobileNo",
      error: error.message,
    });
  }
};

export default { requestEmailOTP, requestMobileOtp, verifyEmailOtp, verifyMobileOtp };
module.exports = { requestEmailOTP, requestMobileOtp, verifyEmailOtp, verifyMobileOtp };
