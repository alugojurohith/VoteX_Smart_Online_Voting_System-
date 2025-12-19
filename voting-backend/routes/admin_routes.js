const express = require("express");
const router = express.Router();
const Voter = require("../models/voter_model");

// Controllers
const {
  adminLogin,
  uploadVotersFromExcel,
} = require("../controllers/admin_controller");

// Middleware
const authAdmin = require("../middleware/authAdmin");
const excelUpload = require("../middleware/excelUpload");

// ------------------------------------
// Admin Login
// ------------------------------------
router.post("/login", adminLogin);

// ------------------------------------
// Upload voters (ADMIN PROTECTED)
// ------------------------------------
router.post(
  "/upload-voters",
  authAdmin,
  excelUpload.single("excelFile"), // ✅ FIXED FIELD NAME
  uploadVotersFromExcel
);

// ------------------------------------
// Get all voters (ADMIN PROTECTED)
// ------------------------------------
router.get("/voters", authAdmin, async (req, res) => {
  try {
    const voters = await Voter.find().select("-__v");
    res.json({ success: true, voters });
  } catch (err) {
    console.error("FETCH VOTERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch voters.",
    });
  }
});

module.exports = router;
