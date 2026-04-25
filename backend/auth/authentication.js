const bcrypt = require("bcrypt");
const winston = require("winston");
const db_connection = require("../config/database/db_connection");
const { JWTService } = require("../config/jwt");
const {
  AuthenticationError,
  ValidationError,
  ConflictError,
  DatabaseError,
  CustomError,
} = require("../config/customerror");

const SALT_ROUNDS = 12;

const register = async (req, res) => {
  const { email, password, name, role_id } = req.body;

  winston.info(`Registration attempt for email: ${email}`, { ip: req.ip });

  const checkUserQuery = "SELECT id FROM users WHERE email = ?";
  db_connection.execute(checkUserQuery, [email], async (err, results) => {
    if (err) {
      winston.error("Database error during user check:", err);
      throw new DatabaseError("Failed to check existing user");
    }

    if (results.length > 0) {
      winston.warn(`Registration failed - user already exists: ${email}`);
      throw new ConflictError("User with this email already exists");
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      winston.error("Password hashing failed:", error.message);
      throw new CustomError("Failed to process password", 500);
    }

    const insertUserQuery = `
      INSERT INTO users (email, password, name, role_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `;

    db_connection.execute(
      insertUserQuery,
      [email, hashedPassword, name, role_id],
      (err, result) => {
        if (err) {
          winston.error("Database error during user creation:", err);
          throw new DatabaseError("Failed to create user");
        }

        const userId = result.insertId;
        const userPayload = {
          id: userId,
          email,
          name,
          role_id,
        };

        const tokens = JWTService.generateTokenPair(userPayload);

        winston.info(`User registered successfully: ${email} (ID: ${userId})`);

        res.status(201).json({
          success: true,
          message: "User registered successfully",
          user: {
            id: userId,
            email,
            name,
            role_id,
          },
          tokens,
        });
      },
    );
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  winston.info(`Login attempt for email: ${email}`, { ip: req.ip });

  const findUserQuery = "SELECT id, email, password FROM users WHERE email = ?";
  db_connection.execute(findUserQuery, [email], async (err, results) => {
    if (err) {
      winston.error("Database error during user lookup:", err.message);
      throw new DatabaseError("Failed to authenticate user");
    }

    if (results.length === 0) {
      winston.warn(`Login failed - user not found: ${email}`);
      throw new AuthenticationError("Invalid email or password");
    }

    const user = results[0];

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      winston.error("Password verification failed:", error.message);
      throw new CustomError("Failed to verify password", 500);
    }

    if (!isPasswordValid) {
      winston.warn(`Login failed - invalid password for: ${email}`);
      throw new AuthenticationError("Invalid email or password");
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role_id: user.role_id,
    };

    const tokens = JWTService.generateTokenPair(userPayload);

    winston.info(`User logged in successfully: ${email} (ID: ${user.id})`);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
      },
      tokens,
    });
  });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  winston.info("Token refresh attempt", { ip: req.ip });

  try {
    const decoded = JWTService.verifyToken(refreshToken, "refresh");

    const findUserQuery =
      "SELECT id, email, name, role_id FROM users WHERE id = ?";
    db_connection.execute(findUserQuery, [decoded.id], (err, results) => {
      if (err) {
        winston.error("Database error during user verification:", err.message);
        throw new DatabaseError("Failed to verify user");
      }

      if (results.length === 0) {
        winston.warn(`Token refresh failed - user not found: ${decoded.id}`);
        throw new AuthenticationError("User not found");
      }

      const user = results[0];
      const userPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
      };

      const tokens = JWTService.generateTokenPair(userPayload);

      winston.info(
        `Token refreshed successfully for user: ${user.email} (ID: ${user.id})`,
      );

      res.json({
        success: true,
        message: "Token refreshed successfully",
        tokens,
      });
    });
  } catch (error) {
    winston.warn(`Token refresh failed: ${error.message}`);
    throw new AuthenticationError("Invalid refresh token");
  }
};

const logout = async (req, res) => {
  const userId = req.user?.id || "unknown";

  winston.info(`User logout: ${userId}`, { ip: req.ip });

  res.json({
    success: true,
    message: "Logout successful",
  });
};

const getProfile = async (req, res) => {
  const userId = req.user.id;

  winston.info(`Profile request for user: ${userId}`);

  const findUserQuery =
    "SELECT id, email, name, role_id, created_at FROM users WHERE id = ?";
  db_connection.execute(findUserQuery, [userId], (err, results) => {
    if (err) {
      winston.error("Database error during profile fetch:", err.message);
      throw new DatabaseError("Failed to fetch user profile");
    }

    if (results.length === 0) {
      winston.warn(`Profile not found for user: ${userId}`);
      throw new NotFoundError("User not found");
    }

    const user = results[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        createdAt: user.created_at,
      },
    });
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};
