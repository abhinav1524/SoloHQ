const Notification = require("../models/Notification");

// 📌 Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const notification = await Notification.create({ user: userId, message, type });

    // Send via Socket.io in real-time
    const io = req.app.get("io");
    if (io) {
      io.to(userId.toString()).emit("newNotification", notification);
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Get all notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Delete one notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Clear all notifications for user
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
};
