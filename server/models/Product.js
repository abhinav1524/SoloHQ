// models/productModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // business owner
      required: true,
    },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }, // inventory lives here
  description: String,
  category: String,
  brand:String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
