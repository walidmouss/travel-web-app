const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const session = require('express-session');
const connectToDatabase = require("./config/dbConfig");
const logger = require("./lib/logger");
const { locations } = require("./constants");

const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({
  secret: 'your-secret-key', // In production, use environment variable
  resave: false,
  saveUninitialized: false
}));

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

// Authentication middleware to check if user is authenticated
function checkAuthentication(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

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
  const successMessage = req.session?.successMessage;
  // Clear the message so it doesn't show again on refresh
  delete req.session?.successMessage;
  
  res.render("login", { 
    error: null, 
    email: "", 
    showRegistrationLink: false,
    successMessage 
  });
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

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render("login", {
        error: "Incorrect password. Please try again.",
        email,
        showRegistrationLink: false,
      });
    }

    // Set the session after successful login
    req.session.userId = user._id;
    req.session.email = user.email;

    res.redirect("/home");
  } catch (error) {
    logger.errorLog("Login error:", error);
    res.render("login", {
      error: "An unexpected error occurred. Please try again later.",
      email: req.body.email,
      showRegistrationLink: false,
    });
  }
});

// Add this after your other routes
app.post("/logout", async (req, res) => {
  try {
    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error logging out");
      }

      // Clear database connection from request
      req.db = null;

      // Redirect to login page
      res.redirect('/login');
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).send("Error logging out");
  }
});

app.get("/home", checkAuthentication, (req, res) => {
  console.log("GET /home route hit");
  res.render("home");
});

app.get("/:category/:location", checkAuthentication, (req, res) => {
  const { category, location } = req.params;
  const locationData = locations.find(loc => loc.locationUrl === `/${category}/${location}`);
  
  if (locationData) {
    res.render('location', locationData);
  } else {
    res.status(404).send('Location not found');
  }
});

app.post("/search", checkAuthentication, (req, res) => {
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

app.get("/search", checkAuthentication, (req, res) => {
  const searchTerm = req.query.search || '';
  const results = locations.filter((location) => {
    return location.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  res.render('searchedStuff', { 
    results: results,
    searchTerm: searchTerm
  });
});

// app.get("/helloKitty", (req, res) => {
//   res.render("rome");
// });

app.get("/dashboard", checkAuthentication, (req, res) => {
  res.render("dashboard", { locations });
});

app.post("/registration", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("registration", { 
        error: "Email and password are required.",
        email: email || ""
      });
    }

    const usersCollection = req.db.collection("users");
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return res.render("registration", {
        error: "This user is already registered.",
        email: email
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      wantToGoList: []
    };

    await usersCollection.insertOne(newUser);
    
    // Set success message in session
    req.session.successMessage = "Registration successful! Please login with your credentials.";
    res.redirect("/login");
    
  } catch (err) {
    console.error("Error registering user:", err);
    res.render("registration", {
      error: "An unexpected error occurred. Please try again later.",
      email: req.body.email || ""
    });
  }
});

// Update the GET route to handle error display
app.get("/registration", (req, res) => {
  res.render("registration", { error: null, email: "" });
});

app.get("/want-to-go", checkAuthentication, async (req, res) => {
  const user = await req.db.collection("users").findOne({ email: req.session.email });

  if (!user) {
    return res.redirect("/login");
  }

  // Render the 'want-to-go' page with the user's want-to-go list
  res.render("want-to-go", { places: user.wantToGoList });
});


app.post("/add-to-want-to-go", checkAuthentication, async (req, res) => {
  const { locationName, image, description, video, locationUrl } = req.body;
  const userEmail = req.session.email;

  try {
    const user = await req.db.collection("users").findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.wantToGoList.some(place => place.locationName === locationName)) {
      return res.render("location", {
        name: locationName,
        image,
        description,
        video,
        locationUrl,
        errorMessage: "This location is already in your want-to-go list."
      });
    }

    await req.db.collection("users").updateOne(
      { email: userEmail },
      { $push: { wantToGoList: { locationName, image, description, video, locationUrl } } }
    );

    res.render("location", {
      name: locationName,
      image,
      description,
      video,
      locationUrl,
      successMessage: "Location added to your want-to-go list successfully."
    });
  } catch (err) {
    console.error("Error adding location to want-to-go list:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/hiking", checkAuthentication, (req, res) => {
  res.render("hiking");
});

app.get("/cities", checkAuthentication, (req, res) => {
  res.render("cities");
});

app.get("/islands", checkAuthentication, (req, res) => {
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