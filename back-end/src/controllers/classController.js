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

  try {
    const updatedClass = await prisma.class.update({
      where: { id: parseInt(classId) },
      data: { teacherId: parseInt(teacherId) },
    });

    res.json(updatedClass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllClasses, getClassById, assignTeacher };
