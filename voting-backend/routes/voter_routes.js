const express = require("express");
const router = express.Router();
const Voter = require("../models/voter_model");

// Middleware
const authAdmin = require("../middleware/authAdmin");

// -------------------------------
// REGISTER VOTER
// -------------------------------

router.post("/register", authAdmin, async (req, res) => {
  const voter = new Voter(req.body);
  await voter.save();
  res.json({ success: true, voter });
});


module.exports = router;