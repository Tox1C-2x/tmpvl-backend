// src/middlewares/auth.middleware.js

const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid authorization format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      req.user = user;
      next();
    });

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};