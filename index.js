const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const movieRoutes = require("./src/routes/movies");
const authRoutes = require("./src/routes/auth");
const methodOverride = require("method-override");
const path = require("path");
const session = require("express-session");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- Add this line
app.use(methodOverride("_method"));
app.use(methodOverride("_method"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src", "routes", "views"));

app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  console.log("SESSION DEBUG:", req.session);
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.session.userId;
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/movies", movieRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
