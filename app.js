const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const connectToDatabase = require("./config/dbConfig");
const logger = require("./lib/logger");
const { locations } = require("./constants");

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Database middleware - will be initialized after connection
app.use((req, res, next) => {
  if (!app.locals.db) {
    return res.status(500).json({ error: "Database not connected yet. Please try again later." });
  }
  req.db = app.locals.db; // Make db available in route handlers
  next();
});

// Application startup function that ensures database connection before server start
async function startApplication() {
  try {
    // Connect to database first
    const { client, database } = await connectToDatabase();
    logger.log("MongoDB connection established");
    
    // Store database connection in app.locals for global access
    app.locals.db = database;
    
    // Start server only after successful database connection
    startServer(PORT);
  } catch (err) {
    logger.errorLog("Failed to start application:", err);
    process.exit(1);
  }
}

// Routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null, email: "", showRegistrationLink: false });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", {
        error: "Please provide both email and password",
        email,
        showRegistrationLink: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("login", {
        error: "Please enter a valid email address",
        email,
        showRegistrationLink: false,
      });
    }

    const user = await req.db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.render("login", {
        error: `No account found with email ${email}. Please register for a new account or try another email address.`,
        email,
        showRegistrationLink: true,
      });
    }

    if (password !== user.password) {
      return res.render("login", {
        error: "Incorrect password. Please try again.",
        email,
        showRegistrationLink: false,
      });
    }

    res.redirect("/dashboard");
  } catch (error) {
    logger.errorLog("Login error:", error);
    res.render("login", {
      error: "An unexpected error occurred. Please try again later.",
      email: req.body.email,
      showRegistrationLink: false,
    });
  }
});

app.get("/home", (req, res) => {
  console.log("GET /home route hit");
  res.render("home");
});

app.get("/:category/:location", (req, res) => {
  const { category, location } = req.params;
  const locationData = locations.find(loc => loc.url === `/${category}/${location}`);
  
  if (locationData) {
    res.render('location', locationData);
  } else {
    res.status(404).send('Location not found');
  }
});

app.post("/search", (req, res) => {
  const searchTerm = req.body.Search || req.body.search || req.query.search || '';
  
  if (!searchTerm) {
    return res.render('searchedStuff', { 
      results: [], 
      error: "Please enter a search term" 
    });
  }

  const results = locations.filter((location) => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  res.render('searchedStuff', { 
    results: results,
    searchTerm: searchTerm
  });
});

app.get("/search", (req, res) => {
  const searchTerm = req.query.search || '';
  const results = locations.filter((location) => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  res.render('searchedStuff', { 
    results: results,
    searchTerm: searchTerm
  });
});

app.get("/helloKitty", (req, res) => {
  res.render("rome");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { locations });
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.post("/registration", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const usersCollection = req.db.collection("users");
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: "This user is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      wantToGoList: []
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({
      message: "User registered successfully.",
      userId: result.insertedId
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/want-to-go", (req, res) => {
  res.render("want-to-go");
});

app.get("/hiking", (req, res) => {
  res.render("hiking");
});

app.get("/cities", (req, res) => {
  res.render("cities");
});

app.get("/islands", (req, res) => {
  res.render("islands");
});

// Server startup function with port checking
function startServer(port) {
  app
    .listen(port, () => {
      logger.log(`Server running at http://localhost:${port}`);
      logger.log(`To start the app, use 'node app.js'`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        logger.errorLog(`Port ${port} in use. Trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        logger.errorLog(`Server error: ${err.message}`);
      }
    });
}

// Start the application
startApplication();