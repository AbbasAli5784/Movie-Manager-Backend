// Handles all authentication routes like register, login, logout, and user profile
const express = require("express"); // Express for routing
const bcrypt = require("bcryptjs"); // For hashing passwords
const User = require("./models/User"); // User model
const requireLogin = require("./middleware/requireLogin"); // Middleware to protect routes
const router = express.Router(); // Create a new router

// Show the registration form
router.get("/register", (req, res) => {
  res.render("register"); // Render the register page
});

// Handle registration form submission
router.post("/register", async (req, res) => {
  const { username, password } = req.body; // Get username and password from form
  if (!username || !password) {
    // If either field is missing, show error
    return res.render("register", { error: "All fields required." });
  }
  const existingUser = await User.findOne({ username }); // Check if username is taken
  if (existingUser) {
    return res.render("register", { error: "Username already taken." });
  }
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = new User({ username, password: hashedPassword }); // Create new user
  await user.save(); // Save user to database
  res.redirect("/auth/login"); // Redirect to login page
});

// Show the login form
router.get("/login", (req, res) => {
  res.render("login"); // Render the login page
});

// Handle login form submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // Get credentials from form
  const user = await User.findOne({ username }); // Find user by username
  if (!user) {
    // If user not found, show error
    return res.render("login", { error: "Invalid credentials." });
  }
  const isMatch = await bcrypt.compare(password, user.password); // Check password
  if (!isMatch) {
    return res.render("login", { error: "Invalid credentials." });
  }
  req.session.userId = user._id; // Save user ID in session
  res.redirect("/api/movies"); // Redirect to movies page
});

// Log the user out
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login"); // After logout, go to login page
  });
});

// Show the user's profile page (must be logged in)
router.get("/me", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.userId); // Get user from DB
  console.log("User:", user); // Log user info for debugging
  res.render("me", { username: user.username ? user.username : null }); // Render profile page
});

module.exports = router; // Export the router