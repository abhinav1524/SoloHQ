const  express =require("express");
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require ("../controllers/subscriptionController.js");
const {protect,restrictTo} =require("../middleware/authMiddleware.js")
const router = express.Router();

// Public Routes
router.get("/",protect, restrictTo("admin"), getSubscriptions);
router.get("/:id",protect, restrictTo("admin"), getSubscriptionById);

// Admin Routes (later we’ll secure with middleware)
router.post("/",protect,restrictTo("admin"), createSubscription);
router.put("/:id",protect,restrictTo("admin"), updateSubscription);
router.delete("/:id",protect,restrictTo("admin"), deleteSubscription);

module.exports = router;
