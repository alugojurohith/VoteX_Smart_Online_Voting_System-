const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const fs = require("fs");
const Voter = require("../models/voter_model");

// ---------------- ADMIN LOGIN ----------------
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = bcrypt.compareSync(
    password,
    process.env.ADMIN_PASSWORD_HASH
  );

  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    success: true,
    message: "Login successful",
    token,
  });
};

// ---------------- UPLOAD VOTERS ----------------

exports.uploadVotersFromExcel = async (req, res) => {
  let filePath;

  try {
    // ================= FILE CHECK =================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        errorCode: "NO_FILE",
        message: "No file uploaded. Please select an Excel file.",
      });
    }

    filePath = req.file.path;

    // ================= READ EXCEL =================
    let workbook;
    try {
      workbook = xlsx.readFile(filePath);
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_EXCEL",
        message: "Invalid Excel file. Upload .xlsx or .xls only.",
      });
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return res.status(400).json({
        success: false,
        errorCode: "NO_SHEET",
        message: "Excel file has no sheets.",
      });
    }

    let rows;
    try {
      rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "", // avoids undefined cells
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        errorCode: "SHEET_READ_ERROR",
        message: "Unable to read Excel data.",
      });
    }

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        errorCode: "EMPTY_FILE",
        message: "Excel file contains no data.",
      });
    }

    // ================= PROCESS ROWS =================
    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      const name = row.Name || row.FullName || row.name || row.fullName;
      const pin = row.PIN || row.pin;
      const phone = row.Phone || row.phone;

      // ---------- MISSING COLUMNS ----------
      if (!name || !pin || !phone) {
        skipped++;
        errors.push({
          row: rowNumber,
          errorCode: "MISSING_COLUMNS",
          message: "Missing required fields (Name, PIN, Phone).",
          data: row,
        });
        continue;
      }

      const pinStr = pin.toString().trim();
      const cleanPhone = phone.toString().replace(/\D/g, "");

      // ---------- INVALID PIN ----------
      if (pinStr.length < 3) {
        skipped++;
        errors.push({
          row: rowNumber,
          errorCode: "INVALID_PIN",
          message: "PIN value is invalid or too short.",
          value: pin,
        });
        continue;
      }

      // ---------- INVALID PHONE ----------
      if (cleanPhone.length !== 10) {
        skipped++;
        errors.push({
          row: rowNumber,
          errorCode: "INVALID_PHONE",
          message: "Phone number must contain exactly 10 digits.",
          value: phone,
        });
        continue;
      }

      // ---------- DUPLICATE CHECK ----------
      const existingVoter = await Voter.findOne({
        $or: [{ pin: pinStr }, { phone: cleanPhone }],
      });

      if (existingVoter) {
        skipped++;

        let duplicateField = [];
        if (existingVoter.pin === pinStr) duplicateField.push("PIN");
        if (existingVoter.phone === cleanPhone) duplicateField.push("PHONE");

        errors.push({
          row: rowNumber,
          errorCode: "DUPLICATE_ENTRY",
          message: `Duplicate voter found for ${duplicateField.join(" & ")}.`,
          duplicateOn: duplicateField,
        });
        continue;
      }

      // ---------- INSERT ----------
      try {
        await Voter.create({
          name,
          pin: pinStr,
          phone: cleanPhone,
          hasVoted: false,
        });
        inserted++;
      } catch (dbErr) {
        skipped++;
        errors.push({
          row: rowNumber,
          errorCode: "DATABASE_ERROR",
          message: "Failed to insert voter.",
          debug: dbErr.message,
        });
      }
    }

    // ================= RESPONSE =================
    return res.json({
      success: true,
      message:
        inserted === 0
          ? "No voters were inserted due to errors."
          : `${inserted} voter(s) uploaded successfully.`,
      summary: {
        totalRows: rows.length,
        inserted,
        skipped,
      },
      errors: errors.length ? errors : undefined,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Unexpected server error during upload.",
      debug: err.message,
    });
  } finally {
    // ================= CLEANUP =================
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
