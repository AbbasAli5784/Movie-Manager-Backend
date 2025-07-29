const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const requireLogin = require("./middleware/requireLogin");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("register", { error: "All fields required." });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render("register", { error: "Username already taken." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.redirect("/auth/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("login", { error: "Invalid credentials." });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", { error: "Invalid credentials." });
  }
  req.session.userId = user._id;
  res.redirect("/api/movies");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

router.get("/me", requireLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);
  console.log("User:", user);
  res.render("me", { username: user.username ? user.username : null });
});

module.exports = router;