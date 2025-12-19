// middleware/authVoter.js
import jwt from "jsonwebtoken";

const authVoter = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "voter") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.voterId = decoded.voterId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authVoter;
