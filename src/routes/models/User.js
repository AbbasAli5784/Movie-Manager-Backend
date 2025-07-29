// User model for MongoDB
const mongoose = require("mongoose"); // Mongoose for database

// This schema defines what a user looks like in the database
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Username must be unique
  password: { type: String, required: true } // Password is required
});

module.exports = mongoose.model("User", userSchema); // Export the User model