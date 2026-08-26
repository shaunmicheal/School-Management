const prisma = require("../prisma.js");

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
        students: {
          where: { status: "ACTIVE" },
        },
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

async function addStudentToClass(req, res) {
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
  const parsedClassId = parseInt(classId);

  try {
    const targetClass = await prisma.class.findUnique({
      where: { id: parsedClassId },
      select: { teacherId: true, name: true },
    });

    if (!targetClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        parentName,
        parentPhone,
        address,
        classId: parsedClassId,
      },
    });

    if (targetClass.teacherId) {
      await prisma.notification.create({
        data: {
          userId: targetClass.teacherId,
          title: "New Student Added",
          message: `${firstName} ${lastName} has been added to ${targetClass.name}.`,
        },
      });
    }

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function transferStudent(req, res) {
  const { studentId } = req.params;
  const parsedStudentId = parseInt(studentId);

  try {
    const student = await prisma.student.findUnique({
      where: { id: parsedStudentId },
      include: { class: true },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const teacherId = student.class?.teacherId;
    const studentName = `${student.firstName} ${student.lastName}`;
    const className = student.class?.name || "assigned class";

    await prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: parsedStudentId },
        data: {
          status: "TRANSFERRED",
          classId: null,
        },
      });

      if (teacherId) {
        await tx.notification.create({
          data: {
            userId: teacherId,
            title: "Student Transferred",
            message: `${studentName} was removed from ${className} due to transfer.`,
          },
        });
      }
    });

    res.status(200).json({
      message: `${studentName} has been transferred and removed from class.`,
    });
  } catch (error) {
    console.error("Transfer Student Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

module.exports = {
  getAllClasses,
  getClassById,
  assignTeacher,
  addStudentToClass,
  transferStudent,
};
