const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    pin: {
      type: String,
      unique: true,
      sparse: true,   // avoids duplicate index error when null
      trim: true
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },

    otp: String,

    createdAt: { 
      type: Date, 
      default: Date.now 
    },

    hasVoted: { 
      type: Boolean, 
      default: false 
    },

    votedFor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Candidate", 
      default: null 
    },

    votedAt: { 
      type: Date, 
      default: null 
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Voter", voterSchema, "voterslist");
