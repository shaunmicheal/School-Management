const express = require("express");
const router = express.Router();
const prisma = require("../../db");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);
router.get("/", async (req, res) => {
  try {
    const { date, classId } = req.query;
    let whereClause = {};

    // 1. Role / Class access controls
    if (req.user.role !== "ADMIN") {
      const teacherClass = await prisma.class.findUnique({
        where: { teacherId: req.user.id },
      });

      if (!teacherClass) {
        return res.json([]);
      }
      whereClause.student = { classId: teacherClass.id };
    } else if (classId && classId !== "ALL" && classId !== "") {
      whereClause.student = { classId: parseInt(classId, 10) };
    }
    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);

      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          include: { class: true },
        },
        markedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { date: "desc" },
    });
    const formattedRecords = records.map((record) => ({
      ...record,
      status: record.status || (record.present ? "PRESENT" : "ABSENT"),
    }));

    res.json(formattedRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", async (req, res) => {
  const { studentId, present, status, date, records } = req.body;
  const attendanceDate = date ? new Date(`${date}T00:00:00.000Z`) : new Date();

  try {
    if (Array.isArray(records)) {
      const results = await Promise.all(
        records.map(async (item) => {
          const isPresent = item.status === "PRESENT" || item.present === true;
          const statusValue = item.status || (isPresent ? "PRESENT" : "ABSENT");

          return prisma.attendance.upsert({
            where: {
              studentId_date: {
                studentId: parseInt(item.studentId, 10),
                date: attendanceDate,
              },
            },
            update: {
              present: isPresent,
              ...(item.status && { status: statusValue }),
              markedById: req.user.id,
            },
            create: {
              studentId: parseInt(item.studentId, 10),
              present: isPresent,
              ...(item.status && { status: statusValue }),
              date: attendanceDate,
              markedById: req.user.id,
            },
          });
        }),
      );
      return res.json({
        message: "Attendance saved successfully",
        count: results.length,
      });
    }

    const isPresent = status === "PRESENT" || present === true;
    const statusValue = status || (isPresent ? "PRESENT" : "ABSENT");

    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: parseInt(studentId, 10),
          date: attendanceDate,
        },
      },
      update: {
        present: isPresent,
        ...(status && { status: statusValue }),
        markedById: req.user.id,
      },
      create: {
        studentId: parseInt(studentId, 10),
        present: isPresent,
        ...(status && { status: statusValue }),
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
  const classId = parseInt(req.params.classId, 10);

  try {
    const records = await prisma.attendance.findMany({
      where: {
        student: { classId },
      },
      include: {
        student: { include: { class: true } },
        markedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { date: "desc" },
    });

    const formattedRecords = records.map((record) => ({
      ...record,
      status: record.status || (record.present ? "PRESENT" : "ABSENT"),
    }));

    res.json(formattedRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
