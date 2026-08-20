const prisma = require("../../db");

async function getAllClasses(req, res) {
  try {
    const classes = await prisma.class.findMany({
      include: { teacher: { select: { id: true, name: true, email: true } } },
    });
    res.json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getClassById(req, res) {
  const { classId } = req.params;

  try {
    const classData = await prisma.class.findUnique({
      where: { id: parseInt(classId) },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        students: true,
      },
    });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function assignTeacher(req, res) {
  const { classId } = req.params;
  const { teacherId } = req.body;

  const parsedClassId = parseInt(classId);
  const parsedTeacherId = teacherId ? parseInt(teacherId) : null;

  if (isNaN(parsedClassId)) {
    return res.status(400).json({ message: "Invalid class ID" });
  }

  try {
    const classExists = await prisma.class.findUnique({
      where: { id: parsedClassId },
    });

    if (!classExists) {
      return res
        .status(404)
        .json({ message: `Class with ID ${parsedClassId} not found` });
    }

    if (parsedTeacherId) {
      const teacherExists = await prisma.user.findUnique({
        where: { id: parsedTeacherId },
      });

      if (!teacherExists) {
        return res
          .status(404)
          .json({ message: `Teacher with ID ${parsedTeacherId} not found` });
      }
    }

    const updatedClass = await prisma.class.update({
      where: { id: parsedClassId },
      data: { teacherId: parsedTeacherId },
      include: {
        teacher: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(updatedClass);
  } catch (error) {
    console.error("Assign Teacher Error:", error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "This teacher is already assigned to another class.",
      });
    }

    res.status(500).json({ message: error.message || "Server error" });
  }
}

module.exports = { getAllClasses, getClassById, assignTeacher };
