const express = require("express");
const path = require("path");
const connectToDatabase = require("./config/dbConfig");
const logger = require("./lib/logger");
const places = require("./constants/index.js");

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Global database connection
let db;

// GET route - Display login page
app.get("/", (req, res) => {
  res.render("login", { error: null, email: "", showRegistrationLink: false });
});

// POST route - Handle login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.render("login", {
        error: "Please provide both email and password",
        email,
        showRegistrationLink: false,
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render("login", {
        error: "Please enter a valid email address",
        email,
        showRegistrationLink: false,
      });
    }

    // Find user in database
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.render("login", {
        error: `No account found with email ${email}. Please register for a new account or try another email address.`,
        email,
        showRegistrationLink: true,
      });
    }

    // Simple password comparison (not secure for production)
    if (password !== user.password) {
      return res.render("login", {
        error: "Incorrect password. Please try again.",
        email,
        showRegistrationLink: false,
      });
    }

    // Successful login
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

// Add this route to handle GET requests to /login
app.get("/login", (req, res) => {
  res.render("login", { error: null, email: "", showRegistrationLink: false });
});

// Keep your existing root route as a redirect to /login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// GET route - Homepage after login
app.get("/home", (req, res) => {
  console.log("GET /home route hit");
  res.render("home");
});

/////////////////////// home page options /////////////////////////////

app.get("/hiking", (req, res) => {
  res.render("hiking");
});

app.get("/cities", (req, res) => {
  res.render("cities");
});

app.get("/islands", (req, res) => {
  res.render("islands");
});

app.get("/wanttogo", (req, res) => {
  res.render("wanttogo");
});

//////////////////// hiking option //////////////////

app.get("/hiking/inca", (req, res) => {
  res.render("inca");
});

app.get("/hiking/annapurna", (req, res) => {
  res.render("annapurna");
});

/////////////////// cities options //////////////////////

app.get("/cities/paris", (req, res) => {
  res.render("paris");
});

app.get("/cities/rome", (req, res) => {
  res.render("rome");
});

////////////////// islands options //////////////////////

app.get("/islands/bali", (req, res) => {
  res.render("bali");
});

app.get("/islands/santorini", (req, res) => {
  res.render("santorini");
});

///////////////////////// POST route for search ^_^ (25%)///////////////////////////////

app.post("/search", (req, res) => {
  const { Search } = req.body;
  console.log(req.body);
  // if there is no input data output an error
  if (!Search) {
    return res.status(400).json({ error: "Search term is missing" });
  }
  //.filter creates a new array that satisfies a certain criteria
  const out = places.filter((places) => {
    // used the function .tolowercase() to be case insensitive
    return places.name.toLowerCase().includes(Search.toLowerCase());
  });
  // Respond with the search term and filtered results (out)
  res.json({ searchTerm: Search, results: out });

  //res.json({find});
});

// GET route - Dashboard (just as an example)
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { locations});
});

// GET route - Registration page
app.get("/registration", (req, res) => {
  res.render("registration");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation (add more as needed)
    if (!username || !password) {
      return res.render("registration", {
        error: "Please provide both username and password",
        username: username || "", // Keep the entered username
      });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.render("registration", {
        error: "Username already exists",
        username: username || "",
      });
    }

    // Hash the password (important for security - use bcrypt or similar in production)
    const hashedPassword = password; // Replace with actual hashing

    // Insert the new user into the database
    await db
      .collection("users")
      .insertOne({ username, password: hashedPassword });

    // Redirect to login page or dashboard after successful registration
    res.redirect("/");
  } catch (error) {
    logger.errorLog("Registration error:", error);
    res.render("registration", {
      error: "An unexpected error occurred. Please try again later.",
      username: req.body.username || "",
    });
  }
});

// MongoDB connection setup
connectToDatabase()
  .then((client) => {
    logger.log("MongoDB connection established");
    db = client.db("yourDatabaseName"); // Store the database connection
  })
  .catch((err) => {
    logger.errorLog("MongoDB connection failed");
  });

// Start server with a dynamic port checker
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

startServer(PORT);
