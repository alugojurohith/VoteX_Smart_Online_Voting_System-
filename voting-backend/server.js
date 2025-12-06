// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/dbconfig");  // ✅ VERY IMPORTANT (connects database)

const app = express();
app.use(cors());
app.use(express.json());

// Admin Routes
const adminRoutes = require("./routes/admin_routes");
app.use("/api/admin", adminRoutes);
const candidateRoutes = require("./routes/candidate_routes");
app.use("/api/candidates", candidateRoutes);
const voterRoutes = require("./routes/voter_routes");
app.use("/api/voters", voterRoutes);
const authRoutes = require("./routes/auth_routes");
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
