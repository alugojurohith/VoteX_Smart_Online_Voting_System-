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
const upload = require("../middleware/upload");

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
  upload.single("excelFile"),
  uploadVotersFromExcel
);

router.get("/voters", authAdmin, async (req, res) => {
  try {
    const voters = await Voter.find().select("-__v");
    res.json({ success: true, voters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
