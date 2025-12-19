const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const fs = require("fs");
const Voter = require("../models/voter_model");

// =======================================================
// 🔐 ADMIN LOGIN
// =======================================================
exports.adminLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = bcrypt.compareSync(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// =======================================================
// 📊 UPLOAD VOTERS FROM EXCEL
// =======================================================
exports.uploadVotersFromExcel = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No Excel file uploaded",
      });
    }

    filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(
      workbook.Sheets[sheetName],
      { defval: "" }
    );

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
     const name =
  row["Name"] ||
  row["Full Name"] ||
  row["FullName"] ||
  row["name"] ||
  row["fullName"];

const pin =
  row["PIN"] ||
  row["Pin"] ||
  row["Pin Code"] ||
  row["pin"];

const phone =
  row["Phone"] ||
  row["PHONE"] ||
  row["Mobile"] ||
  row["Phone Number"] ||
  row["phone"];

      if (!name || !pin || !phone) {
        skipped++;
        errors.push({ row: i + 2, message: "Missing fields" });
        continue;
      }

      const cleanPhone = phone.toString().replace(/\D/g, "");
      const pinStr = pin.toString();

      if (cleanPhone.length !== 10) {
        skipped++;
        continue;
      }

      const exists = await Voter.findOne({
        $or: [{ pin: pinStr }, { phone: cleanPhone }],
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Voter.create({
        name,
        pin: pinStr,
        phone: cleanPhone,
        hasVoted: false,
      });

      inserted++;
    }

    res.json({
      success: true,
      message: `${inserted} voters uploaded`,
      summary: { inserted, skipped },
      errors,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error processing Excel file",
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
