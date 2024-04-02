const fs = require("fs");
const path = require("path");

// Middleware to track API usage and log to daily file
function trackAPIUsage(req, res, next) {
  const apiEndpoint = req.originalUrl;
  const currentDate = new Date().toISOString().slice(0, 10);
  const logFilePath = path.join(__dirname, "logs", `${currentDate}LOGS.txt`);
  const logMessage = `${new Date().toISOString()} - API Usage: ${apiEndpoint}\n`;

  // Create logs directory if not exists
  const logsDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  // Append log message to daily log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
}

module.exports = trackAPIUsage;
