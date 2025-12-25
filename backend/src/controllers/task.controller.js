const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .populate("category")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid user id" });
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    if (!req.body.title)
      return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({ ...req.body, user: req.user._id });
    await task.populate("category");
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("category");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
