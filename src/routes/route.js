const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get Test" });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get test with ID: ${id}` });
});

router.post("/", (req, res) => {
  const data = req.body;
  res.json({ message: "Post Test", data });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  res.json({ message: `UPDATE Test with ID ${id}`, updatedData });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `DELETE Test with ID ${id}` });
});

module.exports = router;
