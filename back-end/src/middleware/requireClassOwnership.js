const prisma = require("../../db");

const requireClassOwnership = async (req, res, next) => {
  const { role, id: userId } = req.user;
  const requestedClassId = parseInt(req.params.classId || req.body.classId);

  if (role === "ADMIN") return next();

  try {
    const teacherClass = await prisma.class.findUnique({
      where: { teacherId: userId },
    });

    if (!teacherClass || teacherClass.id !== requestedClassId) {
      return res.status(403).json({
        message:
          "Access denied. You can only access students in your assigned class.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = requireClassOwnership;
