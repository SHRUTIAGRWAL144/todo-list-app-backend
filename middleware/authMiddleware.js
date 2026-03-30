const jwt = require("jsonwebtoken");
const blacklistedTokens = require("./tokenBlacklist"); 

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    //for Logout API:check if token is logged out
    if (blacklistedTokens.has(token)) {
      return res.status(401).json({
        message: "Token is invalid. Please login again"
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request
    req.user = decoded; // { userId: ... }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

module.exports = authMiddleware;