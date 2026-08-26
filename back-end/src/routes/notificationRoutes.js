const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/user/:userId", getUserNotifications);
router.patch("/:id/read", markAsRead);

module.exports = router;
