const { body, validationResult } = require("express-validator");

const winston = require("winston");
const { ValidationError, AuthenticationError } = require("../config/customerror");
const { JWTService } = require("../config/jwt");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = JWTService.extractTokenFromHeader(authHeader);

  if (!token) {
    winston.warn("Authentication attempt without token", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
    });
    throw new AuthenticationError("Access token is required");
  }

  try {
    const decoded = JWTService.verifyToken(token, "access");
    req.user = decoded;
    winston.info(`User authenticated: ${decoded.id || decoded.email}`);
    next();
  } catch (error) {
    winston.warn(`Token verification failed: ${error.message}`, {
      ip: req.ip,
      token: token.substring(0, 20) + "...",
    });
    throw new AuthenticationError("Invalid or expired token");
  }
};

const validateRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),
  body("role_id").isInt({ min: 1 }).withMessage("Invalid role ID"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateRefreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    winston.warn("Validation failed", {
      errors: errorMessages,
      ip: req.ip,
      url: req.url,
    });
    throw new ValidationError("Validation failed", errorMessages);
  }
  next();
};

module.exports = {
  authenticateToken,
  validateRegistration,
  validateLogin,
  validateRefreshToken,
  handleValidationErrors,
};
