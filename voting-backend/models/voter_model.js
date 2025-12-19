const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    pin: { type: String, unique: true, sparse: true, trim: true },

    phone: { type: String, unique: true, sparse: true, trim: true },

    hasVoted: { type: Boolean, default: false },

    votedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },

    votedAt: { type: Date, default: null },

    voteHash: { type: String, default: null }, // ✅ lowercase fixed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voter", voterSchema, "voterslist");
