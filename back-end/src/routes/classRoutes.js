const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/requireAdmin");
const requireClassOwnership = require("../middleware/requireClassOwnership");
const {
  getAllClasses,
  getClassById,
  assignTeacher,
} = require("../controllers/classController");

router.get("/", authenticate, getAllClasses);
router.get("/:classId", authenticate, requireClassOwnership, getClassById);
router.put(
  "/:classId/assign-teacher",
  authenticate,
  requireAdmin,
  assignTeacher,
);

module.exports = router;
