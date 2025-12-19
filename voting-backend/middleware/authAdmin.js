const jwt = require("jsonwebtoken");

function authAdmin(req, res, next) {
  try {
    // Accept both Authorization & authorization
    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        errorCode: "NO_TOKEN",
        message: "Authorization token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Role check
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        errorCode: "NOT_ADMIN",
        message: "Admin access required.",
      });
    }

    // Attach admin info
    req.admin = {
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("AUTH ADMIN ERROR:", err.message);

    return res.status(401).json({
      success: false,
      errorCode: "INVALID_TOKEN",
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authAdmin;
