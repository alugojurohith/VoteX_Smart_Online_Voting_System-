const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./config/dbconfig");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", require("./routes/admin_routes"));
app.use("/api/candidates", require("./routes/candidate_routes"));
app.use("/api/voters", require("./routes/voter_routes"));
app.use("/api/auth", require("./routes/auth_routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
