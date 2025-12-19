// controllers/authController.js
import crypto from "crypto";
import Voter from "../models/Voter.js";

export const sendOtp = async (req, res) => {
  const { phone } = req.body;

  const voter = await Voter.findOne({ phone });
  if (!voter) return res.status(404).json({ message: "Voter not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  voter.otp = otp;
  voter.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  await voter.save();

  // send OTP via SMS (Twilio)
  console.log("OTP:", otp);

  res.json({ message: "OTP sent" });
};
