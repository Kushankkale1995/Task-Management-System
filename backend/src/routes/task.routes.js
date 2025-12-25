const router = require("express").Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Get all tasks for logged-in user
router.get("/", verifyToken, getTasks);

// Create new task
router.post("/", verifyToken, createTask);

// Update task by id
router.put("/:id", verifyToken, updateTask);

// Delete task by id
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;
