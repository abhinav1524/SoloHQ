const express = require("express");
const { getOrders,getFilterOrders, addOrder,updateOrder,deleteOrder, updateOrderStatus,getTodaySale } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const {checkFeatureAccess} = require("../middleware/checkFeatureAccess")
const router = express.Router();

router.use(protect);

router.get("/", getOrders);
router.post("/",checkFeatureAccess("whatsapp"), addOrder);
router.put("/:id",checkFeatureAccess("whatsapp"), updateOrder);
router.delete("/:id", deleteOrder);
router.put("/status/:id", updateOrderStatus);
router.get("/status", getFilterOrders);
router.get("/todaysales", getTodaySale);

module.exports = router;
