import crypto from "crypto";
import _config from "../config/config";

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashOTP = async (otp: string): Promise<string> => {
  return crypto
    .createHmac("sha256", _config.OTP_SECRET || "default_otp_secret")
    .update(otp)
    .digest("hex");
};

export default { generateOtp, hashOTP };
module.exports = { generateOtp, hashOTP };
