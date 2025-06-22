const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
