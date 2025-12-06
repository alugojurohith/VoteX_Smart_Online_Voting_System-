const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  party: {
    type: String,
    required: true,
    trim: true,
  },

  candidatePhoto: {
    type: String,  
    required: true,
  },

  partySymbol: {
    type: String, 
    required: true,
  },

  votes: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Candidate", candidateSchema, "candidateslist");
