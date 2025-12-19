const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate_model");
const Voter = require("../models/voter_model");
const upload = require("../middleware/upload");

// -------------------------------
// ADD CANDIDATE
// -------------------------------
router.post(
  "/add",
  upload.fields([
    { name: "candidatePhoto", maxCount: 1 },
    { name: "partyLogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { fullName, party } = req.body;

      if (!fullName || !party) {
        return res.status(400).json({
          success: false,
          message: "Full name and party are required",
        });
      }

      // ✅ STORE RELATIVE URL PATHS (NOT FILE SYSTEM PATHS)
      const candidatePhoto = req.files?.candidatePhoto
        ? `/uploads/${req.files.candidatePhoto[0].filename}`
        : null;

      const partySymbol = req.files?.partyLogo
        ? `/uploads/${req.files.partyLogo[0].filename}`
        : null;

      const newCandidate = new Candidate({
        fullName: fullName.trim(),
        party: party.trim(),
        candidatePhoto,
        partySymbol,
      });

      await newCandidate.save();

      res.status(201).json({
        success: true,
        message: "Candidate added successfully",
        candidate: newCandidate,
      });
    } catch (error) {
      console.error("ADD CANDIDATE ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Server error while adding candidate",
      });
    }
  }
);

// -------------------------------
// GET ALL CANDIDATES
// -------------------------------
router.get("/list", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -------------------------------
// DELETE A CANDIDATE
// -------------------------------
router.delete("/delete/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;
    const deleted = await Candidate.findByIdAndDelete(candidateId);

    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Delete candidate error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -------------------------------
// VOTE FOR A CANDIDATE
// -------------------------------
router.post("/vote/:id", async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { voterId } = req.body;

    if (!voterId) {
      return res.status(400).json({ message: "voterId is required" });
    }

    const voter = await Voter.findById(voterId);
    if (!voter) return res.status(404).json({ message: "Voter not found" });
    if (voter.hasVoted) return res.status(400).json({ message: "Voter already voted" });

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    voter.hasVoted = true;
    voter.votedFor = updatedCandidate._id;
    voter.votedAt = new Date();
    await voter.save();

    res.json({
      message: "Vote recorded successfully",
      candidate: updatedCandidate,
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




module.exports = router;
