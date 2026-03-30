const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const blacklistedTokens = require("../../middleware/tokenBlacklist");

router.post("/logout", authMiddleware, (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found"
      });
    }

    // blacklist the token
    blacklistedTokens.add(token);

    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
});

module.exports = router;