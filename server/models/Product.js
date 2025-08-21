// models/productModel.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }, // inventory lives here
  description: String,
  category: String
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
