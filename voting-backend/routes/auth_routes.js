const express = require("express");
const router = express.Router();
const Voter = require("../models/voter_model");
const crypto = require("crypto");

// -------------------------------------------
// CONFIG
// -------------------------------------------
const HMAC_SECRET = process.env.OTP_HMAC_SECRET || "change_me";
const otpStore = new Map();

// -------------------------------------------
// HELPERS
// -------------------------------------------
function generateOtp(length = 6) {
  return String(Math.floor(Math.random() * Math.pow(10, length))).padStart(length, "0");
}

function hashOtp(phone, otp) {
  return crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(`${phone}:${otp}`)
    .digest("hex");
}

function normalizePhone(p = "") {
  const digits = p.replace(/\D/g, "");
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

// -------------------------------------------
// SEND OTP
// POST /api/voters/send-otp
// -------------------------------------------
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: "phone required" });
    }

    const normalizedPhone = normalizePhone(phone);

    const voter = await Voter.findOne({ phone: normalizedPhone });
    if (!voter) {
      return res.status(404).json({ success: false, message: "Voter not found" });
    }

    if (voter.hasVoted) {
      return res.status(400).json({
        success: false,
        alreadyVoted: true,
        message: "You have already voted. OTP cannot be sent.",
      });
    }

    // Generate and store OTP
    const otp = generateOtp(6);
    const hashed = hashOtp(normalizedPhone, otp);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(normalizedPhone, { hashed, otp, expiresAt });

    console.log(`OTP for ${normalizedPhone}: ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent",
      otp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// -------------------------------------------
// VERIFY OTP
// POST /api/voters/verify-otp
// -------------------------------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "phone and otp required" });
    }

    const normalizedPhone = normalizePhone(phone);

    const record = otpStore.get(normalizedPhone);
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "otp not found or expired",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedPhone);
      return res.status(400).json({ success: false, message: "otp expired" });
    }

    const hashedAttempt = hashOtp(normalizedPhone, otp);

    try {
      const a = Buffer.from(hashedAttempt, "hex");
      const b = Buffer.from(record.hashed, "hex");

      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(400).json({ success: false, message: "invalid otp" });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: "invalid otp" });
    }

    // Ensure voter exists
    const voter = await Voter.findOne({ phone: normalizedPhone });
    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "voter not found",
      });
    }

    otpStore.delete(normalizedPhone);

    return res.json({
      success: true,
      voterId: voter._id,
      hasVoted: Boolean(voter.hasVoted),
      message: "OTP verified",
    });
  } catch (err) {
    console.error("verify-otp unexpected error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// -------------------------------------------
// GET VOTER STATUS
// GET /api/voters/status/:id
// -------------------------------------------
router.get("/status/:id", async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id).lean();

    if (!voter) {
      return res.status(404).json({ success: false, message: "voter not found" });
    }

    return res.json({
      success: true,
      voterId: voter._id,
      hasVoted: Boolean(voter.hasVoted),
      votedFor: voter.votedFor || null,
    });
  } catch (err) {
    console.error("voter status error:", err);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;