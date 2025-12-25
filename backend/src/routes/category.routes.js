const router = require("express").Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Get all categories
router.get("/", verifyToken, getCategories);

// Create a new category
router.post("/", verifyToken, createCategory);

// Update category
router.put("/:id", verifyToken, updateCategory);

// Delete category
router.delete("/:id", verifyToken, deleteCategory);

module.exports = router;
