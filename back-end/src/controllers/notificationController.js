const prisma = require("../../db");

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification." });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
};
