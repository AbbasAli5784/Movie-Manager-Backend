const express = require("express");

const mongoose = require("mongoose");

const router = express.Router();



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



// GET all movies

router.get("/", async (req, res) => {

 try {

  const movies = await Movie.find();

  res.json(movies);

 } catch (err) {

  res.status(500).json({ error: "Failed to fetch movies" });

 }

});



// GET movie by ID

router.get("/:id", async (req, res) => {

 try {

  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).json({ error: "Movie not found" });

  res.json(movie);

 } catch (err) {

  res.status(500).json({ error: "Error fetching movie" });

 }

});



// POST new movie

router.post("/", async (req, res) => {

 const { name, description, year, genres, rating, user } = req.body;



 if (!name || !description || !year || !genres || !rating) {

  return res.status(400).json({ error: "All fields are required" });

 }



 try {

  const newMovie = new Movie({

   name,

   description,

   year,

   genres: genres.split(',').map(g => g.trim()), // expects comma-separated string

   rating,

   user,

  });



  await newMovie.save();

  res.status(201).json(newMovie);

 } catch (err) {

  res.status(500).json({ error: "Failed to add movie" });

 }

});



// PUT update movie

router.put("/:id", async (req, res) => {

 try {

  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {

   new: true,

  });

  if (!updatedMovie) return res.status(404).json({ error: "Movie not found" });

  res.json(updatedMovie);

 } catch (err) {

  res.status(500).json({ error: "Failed to update movie" });

 }

});



// DELETE movie

router.delete("/:id", async (req, res) => {

 try {

  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deletedMovie) return res.status(404).json({ error: "Movie not found" });

  res.json({ message: "Movie deleted successfully" });

 } catch (err) {

  res.status(500).json({ error: "Failed to delete movie" });

 }

});



module.exports = router;