// Importing required modules for the app
const express = require("express"); // Express framework for building the server
const mongoose = require("mongoose"); // Mongoose for MongoDB object modeling
const dotenv = require("dotenv"); // Loads environment variables from .env file
const movieRoutes = require("./src/routes/movies"); // Movie-related routes
const authRoutes = require("./src/routes/auth"); // Authentication routes
const methodOverride = require("method-override"); // Allows us to use HTTP verbs like PUT or DELETE in places where the client doesn't support it
const path = require("path"); // Node.js path module
const session = require("express-session"); // Session middleware for handling user sessions

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse URL-encoded data (from forms, etc.)
app.use(express.urlencoded({ extended: true })); 
// Allow method override for forms (so we can use PUT/DELETE in HTML forms)
app.use(methodOverride("_method"));
app.use(methodOverride("_method"));
// Set Pug as the view engine for rendering templates
app.set("view engine", "pug");
// Set the directory where Pug templates are located
app.set("views", path.join(__dirname, "src", "routes", "views"));

// Configure session middleware for user authentication and flash messages
app.use(
  session({
    secret: "yourSecretKey", // Secret key for signing the session ID cookie (should be stored securely in production)
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
  })
);

// Debugging middleware to log session data on every request
app.use((req, res, next) => {
  console.log("SESSION DEBUG:", req.session); // See what's in the session for each request
  next();
});

// Make the user ID available in all views (handy for showing/hiding UI elements)
app.use((req, res, next) => {
  res.locals.user = req.session.userId; // Attach userId to res.locals so Pug templates can access it
  next();
});

// Connect to MongoDB using the URI from the .env file
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected")) // Success message
  .catch((err) => console.error("MongoDB connection error:", err)); // Error message if connection fails

// Mount the movie routes under /api/movies (all movie-related endpoints go here)
app.use("/api/movies", movieRoutes);
// Mount the authentication routes under /auth (login, register, etc.)
app.use("/auth", authRoutes);

// Basic home route to check if the API is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server on the specified port (from .env or default to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`); // Log the port for convenience
});
