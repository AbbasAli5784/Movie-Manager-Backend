const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("./middleware/requireLogin");

// Define Movie schema
const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  genres: [{ type: String, required: true }],
  rating: { type: Number, required: true },
  user: { type: String } // Optional: can be used later for login/auth
});

// Create Movie model
const Movie = mongoose.model("Movie", movieSchema);

// GET all movies (Render with Pug)
router.get("/", requireLogin, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.render("index", { movies, user: req.session.userId });
  } catch (err) {
    res.status(500).send("Failed to fetch movies.");
  }
});

// GET form to add a movie
router.get("/add", requireLogin, (req, res) => {
  res.render("addMovie"); // Render addMovie.pug
});
// GET movie by ID (Render with Pug)
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");
    res.render("movie", { movie }); // Render movie.pug
  } catch (err) {
    res.status(500).send("Error fetching movie.");
  }
});



// POST new movie
router.post("/", requireLogin, async (req, res) => {
  const { name, description, year, genres, rating, user } = req.body;

  if (!name || !description || !year || !genres || !rating) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const newMovie = new Movie({
      name,
      description,
      year,
      genres: genres.split(',').map(g => g.trim()),
      rating,
      user,
    });

    await newMovie.save();
    res.redirect("/api/movies"); // Redirect after creation
  } catch (err) {
    res.status(500).send("Failed to add movie.");
  }
});

// GET form to edit a movie
router.get("/:id/edit", requireLogin, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie || movie.user != req.session.userId) {
    return res.status(403).send("Forbidden");
  }
  res.render("editMovie", { movie });
});

// PUT update movie
router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedMovie) return res.status(404).send("Movie not found.");
    res.redirect(`/api/movies/${req.params.id}`);
  } catch (err) {
    res.status(500).send("Failed to update movie.");
  }
});

// DELETE movie
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).send("Movie not found.");
    res.redirect("/api/movies");
  } catch (err) {
    res.status(500).send("Failed to delete movie.");
  }
});

module.exports = router;
