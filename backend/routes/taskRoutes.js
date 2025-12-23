const router = require("express").Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllTasksPublic,
} = require("../controllers/taskController");
const { authenticateJWT } = require("../middleware/authMiddleware");

router.get("/public", getAllTasksPublic);
router.get("/", authenticateJWT, getTasks);
router.post("/", authenticateJWT, createTask);
router.put("/:id", authenticateJWT, updateTask);
router.delete("/:id", authenticateJWT, deleteTask);

module.exports = router;
