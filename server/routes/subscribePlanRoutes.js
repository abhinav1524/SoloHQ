const express = require("express");
const router = express.Router();
const subscribeUser = require("../controllers/subscribeController");
const { protect } = require("../middleware/authMiddleware"); // normal user must be logged in

// Subscribe to a plan
router.post("/subscribe", protect, subscribeUser);

module.exports = router;
