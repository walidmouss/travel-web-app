const express = require("express");
const path = require("path");
const connectToDatabase = require("./config/dbConfig");
const logger = require("./lib/logger");

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("login");
});

// MongoDB connection setup
connectToDatabase()
  .then(client => {
    logger.log("MongoDB connection established");
    client.close();
  })
  .catch(err => {
    logger.errorLog("MongoDB connection failed");
  });

// Start server with a dynamic port checker
function startServer(port) {
  app.listen(port, () => {
    logger.log(`Server running at http://localhost:${port}`);
    logger.log(`To start the app, use 'node app.js'`);
  }).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      logger.errorLog(`Port ${port} in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      logger.errorLog(`Server error: ${err.message}`);
    }
  });
}

startServer(PORT);