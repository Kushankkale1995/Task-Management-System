const router = require("express").Router();
const { getProfile, updateProfile } = require("../controllers/user.controller");
const { getAllUsers } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Get current logged-in user profile
router.get("/me", verifyToken, getProfile);

// Get all users (protected)
router.get("/", verifyToken, getAllUsers);

// Update logged-in user profile
router.put("/me", verifyToken, updateProfile);

module.exports = router;
