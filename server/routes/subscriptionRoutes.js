import express from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscriptionController.js";

const router = express.Router();

// Public Routes
router.get("/", getSubscriptions);
router.get("/:id", getSubscriptionById);

// Admin Routes (later we’ll secure with middleware)
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
