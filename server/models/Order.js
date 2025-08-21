const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  status: { type: String, default: "pending" }, // pending, shipped, delivered, canceled
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
