const jwt = require("jsonwebtoken");

module.exports = function authVoter(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "voter") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.voterId = decoded.voterId; // ✅ correct
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
