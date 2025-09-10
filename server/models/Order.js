const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(  {
    customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",   // references Customer model
    required: true,
  },
    product: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["pending", "complete", "cancel"], 
      default: "pending",
    },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String }, 
  },
  { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
