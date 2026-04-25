const express = require("express");
const winston = require("winston");
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} = require("../auth/authentication");
const {
  authenticateToken,
  validateRefreshToken,
  handleValidationErrors,
  validateRegistration,
  validateLogin,
} = require("../middleware/auth");

const router = express.Router();

router.get("/health", (req, res) => {
  winston.info("Health check requested");
  res.json({
    success: true,
    message: "Authentication service is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  register,
);
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  login,
);



router.post(
  "/refresh",
  validateRefreshToken,
  handleValidationErrors,
  refreshToken,
);

router.post("/logout", authenticateToken, logout);

router.get("/profile", authenticateToken, getProfile);

module.exports = router;
