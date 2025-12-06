const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate_model");
const Voter = require("../models/voter_model");
const upload = require("../middleware/multer");

// -------------------------------
// ADD CANDIDATE
// -------------------------------
router.post(
  "/add",
  upload.fields([
    { name: "candidatePhoto", maxCount: 1 },
    { name: "partyLogo", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { fullName, party } = req.body;

      if (!fullName || !party) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // file paths from multer
      const candidatePhoto = req.files?.candidatePhoto
        ? req.files.candidatePhoto[0].path.replace(/\\/g, "/")
        : null;

      const partyLogo = req.files?.partyLogo
        ? req.files.partyLogo[0].path.replace(/\\/g, "/")
        : null;

      const newCandidate = new Candidate({
        fullName,
        party,
        candidatePhoto,
        partySymbol: partyLogo, // store partySymbol field
      });

      await newCandidate.save();

      res.status(201).json({
        message: "Candidate added successfully",
        candidate: newCandidate,
      });
    } catch (error) {
      console.error("Add candidate error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
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
