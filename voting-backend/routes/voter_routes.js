const express = require("express");
const router = express.Router();
const Voter = require("../models/voter_model");

// -------------------------------
// REGISTER VOTER
// -------------------------------

router.post("/register", async (req, res) => {
  const voter = new Voter(req.body);
  await voter.save();
  res.json({ success: true, voter });
});


module.exports = router;