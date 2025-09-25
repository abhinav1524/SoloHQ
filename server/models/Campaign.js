const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  channel: { type: String, enum: ["WhatsApp", "Email", "Instagram", "Facebook"] },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  reminderTime: {
  type: String, // store as "HH:mm"
  required: true,
},
reminderSent: { type: Boolean, default: false } // new flag
});

module.exports = mongoose.model("Campaign", campaignSchema);
