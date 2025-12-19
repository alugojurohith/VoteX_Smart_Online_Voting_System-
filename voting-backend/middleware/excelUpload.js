const multer = require("multer");
const path = require("path");
const fs = require("fs");

const EXCEL_UPLOADS_FOLDER = path.join(__dirname, "../uploads/excel");

if (!fs.existsSync(EXCEL_UPLOADS_FOLDER)) {
  fs.mkdirSync(EXCEL_UPLOADS_FOLDER, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, EXCEL_UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter: excelFilter,
});
