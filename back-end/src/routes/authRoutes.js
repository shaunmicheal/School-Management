const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../db");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "8h" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
