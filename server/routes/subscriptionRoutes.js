const  express =require("express");
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require ("../controllers/subscriptionController.js");

const router = express.Router();

// Public Routes
router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionById);

// Admin Routes (later we’ll secure with middleware)
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

module.exports = router;
