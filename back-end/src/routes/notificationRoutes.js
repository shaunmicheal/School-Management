const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
} = require("../controllers/notificationController"); // Adjust path if needed
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);
router.get("/:userId", getUserNotifications);
router.patch("/:id/read", markAsRead);

module.exports = router;