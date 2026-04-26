const jwt = require("jsonwebtoken");
const winston = require("winston");

const JWT_CONFIG = {
  SECRET_KEY:
    process.env.JWT_SECRET_KEY || "your-secret-key-change-in-production",
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  ISSUER: process.env.JWT_ISSUER || "project-management-portal",
  AUDIENCE: process.env.JWT_AUDIENCE || "project-management-users",
};

class JWTService {
  static generateAccessToken(payload) {
    try {
      const token = jwt.sign(
        {
          ...payload,
          type: "access",
        },
        JWT_CONFIG.SECRET_KEY,
        {
          expiresIn: JWT_CONFIG.EXPIRES_IN,
          issuer: JWT_CONFIG.ISSUER,
          audience: JWT_CONFIG.AUDIENCE,
        },
      );
      winston.info(
        `Access token generated for user: ${payload.id || payload.email || payload.role_id}`,
      );
      return token;
    } catch (error) {
      winston.error("Error generating access token:", error);
      throw error;
    }
  }

  static generateRefreshToken(payload) {
    try {
      const token = jwt.sign(
        {
          ...payload,
          type: "refresh",
        },
        JWT_CONFIG.SECRET_KEY,
        {
          expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
          issuer: JWT_CONFIG.ISSUER,
          audience: JWT_CONFIG.AUDIENCE,
        },
      );
      winston.info(
        `Refresh token generated for user: ${payload.id || payload.email || payload.role_id}`,
      );
      return token;
    } catch (error) {
      winston.error("Error generating refresh token:", error);
      throw error;
    }
  }

  static verifyToken(token, type = "access") {
    try {
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY, {
        issuer: JWT_CONFIG.ISSUER,
        audience: JWT_CONFIG.AUDIENCE,
      });

      if (decoded.type !== type) {
        throw new Error(
          `Invalid token type. Expected ${type}, got ${decoded.type}`,
        );
      }

      winston.info(
        `Token verified successfully for user: ${decoded.id || decoded.email || decoded.role_id}`,
      );
      return decoded;
    } catch (error) {
      winston.error(`Token verification failed: ${error.message}`);
      throw error;
    }
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7);
  }

  static generateTokenPair(payload) {
    try {
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      winston.error("Error generating token pair:", error);
      throw error;
    }
  }
}

module.exports = {
  JWT_CONFIG,
  JWTService,
};
