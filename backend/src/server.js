const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") }); // load .env next to this file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
// Allow Authorization header from browser clients
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
  })
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/users", require("./routes/user.routes"));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Simple error handler (returns JSON)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
