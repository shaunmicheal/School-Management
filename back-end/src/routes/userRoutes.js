const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const prisma = require("../../db");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);
router.use(requireAdmin);

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        class: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password || "password123", 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "TEACHER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  if (userId === req.user.id) {
    return res
      .status(400)
      .json({ message: "You cannot delete your own admin account." });
  }

  try {
    await prisma.class.updateMany({
      where: { teacherId: userId },
      data: { teacherId: null },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
