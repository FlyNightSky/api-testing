const express = require("express");
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const app = require("./app.js");
const movie = require("./movie.js");
const genra = require("./genra.js");
const search = require("./search.js");
const show = require("./show.js");

const index = express();
index.use(cors());
const PORT = 3001;

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

index.use(trackAPIUsage); // Use the middleware for tracking API usage

index.get("/", async (req, res) => {
  try {
    res.status(200).json({
      Welcome:
        "The Api Is On. For The Endpoints Please Visit The Github Repo Or Dm To @10th_fail.sayan On Insta.\n This Api Is A Movie Api.",
    });
  } catch (error) {
    res.status(400).json({ warning: "400" });
  }
});

index.use("/api", app);
index.use("/api", movie);
index.use("/api", genra);
index.use("/api", show);
index.use("/api", search);

index.get("/api-usage", (req, res) => {
  res.json(apiUsage);
});

index.listen(PORT, () => {
  console.log("The server is on port  ", PORT);
});
