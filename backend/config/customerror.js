const winston = require("winston");

class CustomError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class AuthenticationError extends CustomError {
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}

class AuthorizationError extends CustomError {
  constructor(message = "Access denied") {
    super(message, 403);
  }
}

class ValidationError extends CustomError {
  constructor(message = "Validation failed", errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ConflictError extends CustomError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}

class RateLimitError extends CustomError {
  constructor(message = "Too many requests") {
    super(message, 429);
  }
}

class DatabaseError extends CustomError {
  constructor(message = "Database operation failed") {
    super(message, 500);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  winston.info(`Error ${err.statusCode || 500}: ${err.message}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    stack: err.stack,
  });

  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AuthenticationError(message);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AuthenticationError(message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  CustomError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  errorHandler,
  asyncHandler,
};
