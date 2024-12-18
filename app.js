const express = require("express");
const path = require("path");
const connectToDatabase = require("./config/dbConfig");
const logger = require("./lib/logger");
const { locations } = require("./constants");

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

// Dynamic route to handle all location pages
app.get("/:category/:location", (req, res) => {
  const { category, location } = req.params;

  // Find the location data from the locations array
  const locationData = locations.find(loc => loc.url === `/${category}/${location}`)

  // Ensure the location exists in locationData
  if (locationData) {
    res.render('location', locationData);
  } else {
    res.status(404).send('Location not found');
  }
});


///////////////////////// POST route for search ^_^ (25%)///////////////////////////////

app.post("/search", (req, res) => {
  // Check for search term in both req.body and req.query
  const searchTerm = req.body.Search || req.body.search || req.query.search || '';
  
  console.log("Search term received:", searchTerm);

  // If no search term, redirect back to home or render an error page
  if (!searchTerm) {
    return res.render('searchedStuff', { 
      results: [], 
      error: "Please enter a search term" 
    });
  }

  // Filter locations based on the search term (case-insensitive)
  const results = locations.filter((location) => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Render search results page
  res.render('searchedStuff', { 
    results: results,
    searchTerm: searchTerm // Pass search term back to the view
  });
});

// Add a GET route for search to handle URL parameters
app.get("/search", (req, res) => {
  const searchTerm = req.query.search || '';
  
  console.log("Search term from URL:", searchTerm);

  // Filter locations based on the search term (case-insensitive)
  const results = locations.filter((location) => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Render search results page
  res.render('searchedStuff', { 
    results: results,
    searchTerm: searchTerm // Pass search term back to the view
  });
});

// Easter Egg
app.get("/helloKitty", (req, res) => {
  res.render("rome");
})

// GET route - Dashboard (just as an example)
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { locations});
});

// GET route - Registration page
app.get("/registration", (req, res) => {
  res.render("registration");
});

// POST route - Handle registration
app.post("/registration", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Connect to the database and users collection
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection("users");

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This user is already registered." });
    }

    // Insert the new user
    const newUser = {
      email,
      password, // Note: Passwords should be hashed in production
      wantToGoList: [] // Default empty list
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

// GET route - Want-to-go page
app.get("/want-to-go", (req, res) => {
  res.render("want-to-go");
});

// GET route - Want-to-go page
app.get("/hiking", (req, res) => {
  res.render("hiking");
});

// GET route - Want-to-go page
app.get("/cities", (req, res) => {
  res.render("cities");
});

// GET route - Want-to-go page
app.get("/islands", (req, res) => {
  res.render("islands");
});

// MongoDB connection setup
connectToDatabase()
  .then((client) => {
    logger.log("MongoDB connection established");
    db = client.db("travel-web-app"); // Store the database connection
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
