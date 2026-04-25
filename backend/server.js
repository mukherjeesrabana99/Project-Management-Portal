const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const winston = require("winston");
const bodyParser = require("body-parser");
const db_connection = require("./config/database/db_connection");
const configureWinston = require("./config/logger/winston_config");

dotenv.config();

configureWinston();

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.split(","),
  }),
);
app.use(express.json());

const PORT = process.env.PORT || 5000;

db_connection.connect((err) => {
  if (err) {
   
    winston.info("Error connecting to the database: " + err.message);
    return;
  } else {
  
    winston.info("Connected to the database successfully.");
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
