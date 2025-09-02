// controllers/productController.js
const Product = require("../models/productModel.js");
const { sendWhatsAppMessage } = require("../services/whatsappService.js");

 const checkLowInventory = async (req, res) => {
  try {
    // find all products with stock less than 5
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
module.exports=checkLowInventory;