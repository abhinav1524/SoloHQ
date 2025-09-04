const express = require("express");
const {
  addCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  sendMessageToCustomer,
  repeatOrder,
} = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addCustomer);
router.get("/", protect, getCustomers);
router.get("/:id", protect, getCustomer);
router.put("/:id", protect, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

// WhatsApp messaging
router.post("/:id/message", protect, sendMessageToCustomer);

// Repeat order
router.post("/:id/repeat-order", protect, repeatOrder);

module.exports = router;
