const express = require("express");
const router = express.Router();
const prisma = require("../../db");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    if (req.user.role === "ADMIN") {
      const students = await prisma.student.findMany({
        include: { class: true },
      });
      return res.json(students);
    }

    const teacherClass = await prisma.class.findUnique({
      where: { teacherId: req.user.id },
    });

    if (!teacherClass) {
      return res
        .status(404)
        .json({ message: "No class assigned to this teacher." });
    }

    const students = await prisma.student.findMany({
      where: { classId: teacherClass.id },
      include: { class: true },
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    parentName,
    parentPhone,
    address,
    classId,
  } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        parentName,
        parentPhone,
        address,
        classId: parseInt(classId),
      },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (req.user.role === "ADMIN") {
      const updated = await prisma.student.update({
        where: { id: studentId },
        data: req.body,
      });
      return res.json(updated);
    }

    const teacherClass = await prisma.class.findUnique({
      where: { teacherId: req.user.id },
    });

    if (!teacherClass || teacherClass.id !== existingStudent.classId) {
      return res
        .status(403)
        .json({ message: "Access denied. Not your student." });
    }

    const { parentPhone, address } = req.body;
    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...(parentPhone && { parentPhone }),
        ...(address && { address }),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.student.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
