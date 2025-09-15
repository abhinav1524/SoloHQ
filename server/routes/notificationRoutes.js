const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications
} = require("../controllers/NotificatioController");

const { protect } = require("../middleware/authMiddleware");

// Routes (all protected)
router.post("/", protect, createNotification);            // Create
router.get("/", protect, getNotifications);              // Fetch all
router.patch("/:id/read", protect, markAsRead);          // Mark one read
router.delete("/clearall", protect, clearAllNotifications);      // Clear all
router.delete("/:id", protect, deleteNotification);      // Delete one

module.exports = router;
