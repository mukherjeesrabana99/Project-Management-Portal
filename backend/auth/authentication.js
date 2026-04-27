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

  const findUserQuery = `SELECT 
  users.id,
  users.email,
  users.password,
  users.name,
  users.role_id,
  users.client_id,
  roles.role_name
  FROM users
  JOIN roles ON users.role_id = roles.id
  WHERE users.email = ?`;
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
      role_name: user.role_name,
      client_id: user.client_id,
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
        role: user.role_name,
        client_id: user.client_id,
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
        client_id: user.client_id,
        createdAt: user.created_at,
      },
    });
  });
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Name and email are required." });
  }

  const updateQuery = `UPDATE users SET name=?, email=?, updated_at=? WHERE id=?`;
  const params = [name.trim(), email.trim(), new Date(), userId];

  db_connection.execute(updateQuery, params, (err) => {
    if (err) {
      winston.error("Database error during profile update:", err.message);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ success: false, error: "Email is already in use." });
      }
      return res.status(500).json({ success: false, error: "Failed to update profile." });
    }

    winston.info(`User profile updated: ${userId}`);
    res.json({ success: true, message: "Profile updated successfully." });
  });
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: "Current and new passwords are required." });
  }

  const findUserQuery = `SELECT password FROM users WHERE id = ?`;
  db_connection.execute(findUserQuery, [userId], async (err, results) => {
    if (err) {
      winston.error("Database error during password change:", err.message);
      return res.status(500).json({ success: false, error: "Failed to change password." });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const hashedPassword = results[0].password;
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Current password is incorrect." });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const updateQuery = `UPDATE users SET password=?, updated_at=? WHERE id=?`;
    db_connection.execute(updateQuery, [newHashedPassword, new Date(), userId], (updateErr) => {
      if (updateErr) {
        winston.error("Database error updating password:", updateErr.message);
        return res.status(500).json({ success: false, error: "Failed to update password." });
      }

      winston.info(`Password changed for user: ${userId}`);
      res.json({ success: true, message: "Password updated successfully." });
    });
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
