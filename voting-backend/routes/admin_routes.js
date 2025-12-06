const express = require("express");
const router = express.Router();

// Import the admin controller
const { adminLogin } = require("../controllers/admin_controller");

// Route: POST /api/admin/login
router.post("/login", adminLogin);

module.exports = router;
