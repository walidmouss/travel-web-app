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
  const { Search } = req.body;
  console.log(req.body);

  // if there is no input data output an error
  if (!Search) {
    return res.status(400).json({ error: "Search term is missing" });
  }

  // Filter locations based on the search term
  const out = locations.filter((location) => {
    return location.name.toLowerCase().includes(Search.toLowerCase());
  });

  // Check if a location is found and render the page or send a JSON response
  if (out.length > 0) {
    return res.render('searchedStuff', { results: out }); // Render searchedStuff.ejs with the results
  }

  // If no results are found, send an error response
  return res.status(404).json({ error: "No matching locations found" });
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
