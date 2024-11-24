import { ansiColors } from "../constants";

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(
    `\n${ansiColors.fgGreen}[INFO]${ansiColors.reset} ${timestamp}: ${message}`
  );
}

function errorLog(message) {
  const timestamp = new Date().toISOString();
  console.error(
    `${ansiColors.fgRed}[ERROR]${ansiColors.reset} ${timestamp}: ${message}`
  );
}

module.exports = { log, errorLog };