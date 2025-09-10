const express = require("express");
const { getOrders,getFilterOrders, addOrder,updateOrder,deleteOrder, updateOrderStatus,getTodaySale } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.get("/", getOrders);
router.post("/", addOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.put("/status/:id", updateOrderStatus);
router.get("/status", getFilterOrders);
router.get("/todaysales", getTodaySale);

module.exports = router;
