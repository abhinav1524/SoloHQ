// paymentSchema.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  subscriptionPlan: String,       // e.g. "1-month", "6-month"
  planName: String,               // e.g. "Basic-1M"
  price: Number,                  // 199
  durationInMonths: Number,       // 1
  features: [String],             // plan features at the time of purchase
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
