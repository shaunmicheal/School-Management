const express = require("express");
const router = express.Router();
const prisma = require("../../db");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.post("/", async (req, res) => {
  const { studentId, present, date } = req.body;
  const attendanceDate = date ? new Date(date) : new Date();

  try {
    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: parseInt(studentId),
          date: attendanceDate,
        },
      },
      update: { present, markedById: req.user.id },
      create: {
        studentId: parseInt(studentId),
        present,
        date: attendanceDate,
        markedById: req.user.id,
      },
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/class/:classId", async (req, res) => {
  const classId = parseInt(req.params.classId);

  try {
    const records = await prisma.attendance.findMany({
      where: {
        student: { classId },
      },
      include: {
        student: true,
        markedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { date: "desc" },
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
