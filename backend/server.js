const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const winston = require("winston");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const db_connection = require("./config/database/db_connection");
const configureWinston = require("./config/logger/winston_config");
const authRoutes = require("./routes/auth");
const { errorHandler } = require("./config/customerror");

dotenv.config();

configureWinston();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


app.use(express.json())

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN
//       ? process.env.CORS_ORIGIN.split(",")
//       : ["http://localhost:3000"],
//     credentials: true,
//   }),
// );

app.use(cors());

app.get("/api/health", (req, res) => {
  winston.info("Health check requested");
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  winston.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

db_connection.connect((err) => {
  if (err) {
    winston.error("Error connecting to the database: " + err.message);
    process.exit(1);
  } else {
    winston.info("Connected to the database successfully.");
  }

  app.listen(PORT, () => {
    winston.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
});

process.on("SIGTERM", () => {
  winston.info("SIGTERM received, shutting down gracefully");
  db_connection.end(() => {
    winston.info("Database connection closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  winston.info("SIGINT received, shutting down gracefully");
  db_connection.end(() => {
    winston.info("Database connection closed");
    process.exit(0);
  });
});

module.exports = app;
