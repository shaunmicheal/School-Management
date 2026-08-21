const express = require("express");
const router = express.Router();
const prisma = require("../../db");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authenticateToken);
const parseAttendanceDate = (dateStr) => {
  if (!dateStr) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
  }
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

router.get("/", async (req, res) => {
  try {
    const { date, classId } = req.query;
    let whereClause = {};

    if (req.user.role !== "ADMIN") {
      const teacherClass = await prisma.class.findUnique({
        where: { teacherId: parseInt(req.user.id, 10) },
      });

      if (!teacherClass) {
        return res.json([]);
      }
      whereClause.student = { classId: teacherClass.id };
    } else if (classId && classId !== "ALL" && classId !== "") {
      whereClause.student = { classId: parseInt(classId, 10) };
    }

    if (date) {
      const startOfDay = parseAttendanceDate(date);
      const endOfDay = new Date(startOfDay);
      endOfDay.setUTCHours(23, 59, 59, 999);

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
    console.error("GET /attendance error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { studentId, present, status, date, records } = req.body;
  const attendanceDate = parseAttendanceDate(date);
  const userId = req.user?.id ? parseInt(req.user.id, 10) : null;

  try {
    if (Array.isArray(records)) {
      const results = await Promise.all(
        records.map(async (item) => {
          const isPresent = item.status === "PRESENT" || item.present === true;
          const statusValue = item.status || (isPresent ? "PRESENT" : "ABSENT");
          const parsedStudentId = parseInt(item.studentId, 10);

          return prisma.attendance.upsert({
            where: {
              studentId_date: {
                studentId: parsedStudentId,
                date: attendanceDate,
              },
            },
            update: {
              present: isPresent,
              ...(item.status && { status: statusValue }),
              ...(userId && { markedById: userId }),
            },
            create: {
              studentId: parsedStudentId,
              present: isPresent,
              status: statusValue,
              date: attendanceDate,
              ...(userId && { markedById: userId }),
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
    const parsedStudentId = parseInt(studentId, 10);

    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: parsedStudentId,
          date: attendanceDate,
        },
      },
      update: {
        present: isPresent,
        ...(status && { status: statusValue }),
        ...(userId && { markedById: userId }),
      },
      create: {
        studentId: parsedStudentId,
        present: isPresent,
        status: statusValue,
        date: attendanceDate,
        ...(userId && { markedById: userId }),
      },
    });

    res.json(record);
  } catch (error) {
    console.error("POST /attendance error:", error);
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
    console.error("GET /attendance/class error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
