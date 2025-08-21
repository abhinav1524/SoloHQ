// routes/productRoutes.js
import express from "express";
import { checkLowInventory } from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// manually trigger low stock check
router.get("/check-inventory", isAuthenticated, checkLowInventory);

export default router;
