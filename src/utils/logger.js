// src/utils/logger.js

const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "app.log");

const writeLog = (level, message) => {
  const logMessage = `${new Date().toISOString()} [${level}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
};

exports.info = (message) => {
  console.log("ℹ️", message);
  writeLog("INFO", message);
};

exports.error = (message) => {
  console.error("❌", message);
  writeLog("ERROR", message);
};

exports.warn = (message) => {
  console.warn("⚠️", message);
  writeLog("WARN", message);
};