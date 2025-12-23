const router = require("express").Router();
const {
  getUsers,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");

router.get("/", authenticateJWT, getUsers);
router.get("/profile", authenticateJWT, getUserProfile);
router.put("/profile", authenticateJWT, updateUserProfile);

module.exports = router;
