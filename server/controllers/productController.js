// controllers/productController.js
const Product = require("../models/productModel.js");
const { sendWhatsAppMessage } = require("../services/whatsappService.js");

// ✅ Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Name, price, and stock are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// ✅ Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// ✅ Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, brand } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.brand = brand || product.brand;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// ✅ Check low inventory (already written by you)
const checkLowInventory = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } });

    if (lowStockProducts.length > 0) {
      for (let product of lowStockProducts) {
        await sendWhatsAppMessage(
          req.user.phone,
          `⚠️ Inventory Alert: Only ${product.stock} items left for ${product.name}. Restock soon!`
        );
      }
    }

    res.json({ success: true, lowStockProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  checkLowInventory,
};
