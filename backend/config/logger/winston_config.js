
const winston = require("winston");
const configureWinston = () => {
  winston.configure({
    transports: [
      new winston.transports.Console(),
        new winston.transports.File({ filename: "server.log" }),
    ],
  });
}
module.exports = configureWinston;