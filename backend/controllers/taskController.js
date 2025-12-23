const Task = require("../models/Task");

// PUBLIC: Get all tasks
exports.getAllTasksPublic = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("category", "name") // populate category names
      .populate("user", "name email");

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching public tasks:", err);
    res.status(500).json({ message: "Failed to fetch public tasks" });
  }
};

// PROTECTED: Get tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .populate("category", "name") // populate category name
      .populate("user", "name email"); // optional

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// CREATE
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      completed: req.body.completed || false,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Task creation failed" });
  }
};

// UPDATE (OWNER CHECK)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Task update failed" });
  }
};

// DELETE (OWNER CHECK)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Task deletion failed" });
  }
};
