const router = require("express").Router();
const Category = require("../models/Category");
const { authenticateJWT } = require("../middleware/authMiddleware");

router.post("/", authenticateJWT, async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      user: req.user._id,
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
