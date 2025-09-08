const express = require("express");
const { getOrders, addOrder,updateOrder,deleteOrder, updateOrderStatus } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.get("/", getOrders);
router.post("/", addOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.put("status/:id", updateOrderStatus);

module.exports = router;
