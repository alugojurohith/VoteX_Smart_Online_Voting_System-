const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ABSOLUTE PATH → ensures correct upload location
const UPLOADS_FOLDER = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
  console.log("✔ uploads folder created:", UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);  // store inside /uploads
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  }
});

module.exports = multer({ storage });
