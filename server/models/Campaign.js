const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  channel: { type: String, enum: ["WhatsApp", "Email", "Instagram", "Facebook"] },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
