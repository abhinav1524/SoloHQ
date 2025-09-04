// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  checkLowInventory,
} from "../controllers/productController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProduct); // Create product
router.get("/", protect, getProducts); // Get all products
router.get("/:id", protect, getProductById); // Get single product
router.put("/:id", protect, updateProduct); // Update product
router.delete("/:id", protect, deleteProduct); // delete product
// manually trigger low stock check
router.get("/check-inventory", isAuthenticated, checkLowInventory);

export default router;
