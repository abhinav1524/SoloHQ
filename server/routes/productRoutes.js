// routes/productRoutes.js
const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  checkLowInventory,
}= require("../controllers/productController.js");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.post("/", protect, createProduct); // Create product
router.get("/", protect, getProducts); // Get all products
router.get("/:id", protect, getProductById); // Get single product
router.put("/:id", protect, updateProduct); // Update product
router.delete("/:id", protect, deleteProduct); // delete product
// manually trigger low stock check
router.get("/check-inventory", protect, checkLowInventory);

module.exports = router;
