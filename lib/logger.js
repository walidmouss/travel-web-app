// For user-friendly console messages
function log(message) {
  console.log(`[INFO]: ${message}`);
}

function errorLog(message) {
  console.error(`[ERROR]: ${message}`);
}

module.exports = { log, errorLog };