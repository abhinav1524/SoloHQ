const express = require("express");
const { generateCaptions } = require("../services/aiService");
const Product = require("../models/Product");

const router = express.Router();

// POST /api/marketing/captions
router.post("/captions", async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const captions = await generateCaptions(product.name, product.description);

    res.json({
      product: product.name,
      captions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating captions" });
  }
});

module.exports = router;
