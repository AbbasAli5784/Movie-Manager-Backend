// Handles all movie-related routes (CRUD for movies)
const express = require("express"); // Express for routing
const mongoose = require("mongoose"); // Mongoose for MongoDB
const router = express.Router(); // Create a new router
const requireLogin = require("./middleware/requireLogin"); // Middleware to protect routes

// Movie schema defines what a movie looks like in the database
const movieSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Movie name
  description: { type: String, required: true }, // Movie description
  year: { type: Number, required: true }, // Release year
  genres: [{ type: String, required: true }], // List of genres
  rating: { type: Number, required: true }, // Movie rating
  user: { type: String } // User who added the movie
});

// Create the Movie model from the schema
const Movie = mongoose.model("Movie", movieSchema);

// Show all movies (main page)
router.get("/", requireLogin, async (req, res) => {
  try {
    const movies = await Movie.find(); // Get all movies from DB
    res.render("index", { movies, user: req.session.userId }); // Render main page
  } catch (err) {
    res.status(500).send("Failed to fetch movies."); // Error if DB fails
  }
});

// Show form to add a new movie
router.get("/add", requireLogin, (req, res) => {
  res.render("addMovie"); // Render add movie form
});

// Show a single movie by its ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); // Find movie by ID
    if (!movie) return res.status(404).send("Movie not found.");
    res.render("movie", { movie }); // Render movie details page
  } catch (err) {
    res.status(500).send("Error fetching movie.");
  }
});

// Add a new movie to the database
router.post("/", requireLogin, async (req, res) => {
  const { name, description, year, genres, rating, user } = req.body; // Get data from form

  if (!name || !description || !year || !genres || !rating) {
    // If any field is missing, show error
    return res.status(400).send("All fields are required.");
  }

  try {
    const newMovie = new Movie({
      name,
      description,
      year,
      genres: genres.split(',').map(g => g.trim()), // Split genres by comma
      rating,
      user
    });
    await newMovie.save(); // Save movie to DB
    res.redirect("/api/movies"); // Go back to movies list
  } catch (err) {
    res.status(500).send("Error saving movie.");
  }
});

// Show form to edit a movie
router.get("/:id/edit", requireLogin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); // Find movie by ID
    if (!movie) return res.status(404).send("Movie not found.");
    res.render("editMovie", { movie }); // Render edit form
  } catch (err) {
    res.status(500).send("Error loading edit form.");
  }
});

// Update a movie in the database
router.put("/:id", requireLogin, async (req, res) => {
  const { name, description, year, genres, rating } = req.body; // Get updated data
  try {
    await Movie.findByIdAndUpdate(req.params.id, {
      name,
      description,
      year,
      genres: genres.split(',').map(g => g.trim()),
      rating
    });
    res.redirect(`/api/movies/${req.params.id}`); // Go to updated movie page
  } catch (err) {
    res.status(500).send("Error updating movie.");
  }
});

// Delete a movie from the database
router.delete("/:id", requireLogin, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id); // Remove movie
    res.redirect("/api/movies"); // Go back to movies list
  } catch (err) {
    res.status(500).send("Error deleting movie.");
  }
});

module.exports = router; // Export the router
