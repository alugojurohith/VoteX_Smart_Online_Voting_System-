const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute uploads folder
const UPLOADS_FOLDER = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
  console.log("✔ Uploads folder created at:", UPLOADS_FOLDER);
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (Excel only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only Excel files (.xlsx, .xls) are allowed"), false);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = upload;
