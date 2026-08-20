const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

const classController = require("../controllers/classController");

const getAllClasses = classController.getAllClasses;
const getClassById = classController.getClassById;
const assignTeacher = classController.assignTeacher;

router.get("/", authenticateToken, getAllClasses);
router.get("/:classId", authenticateToken, getClassById);
router.put(
  "/:classId/assign-teacher",
  authenticateToken,
  requireAdmin,
  assignTeacher,
);

module.exports = router;
