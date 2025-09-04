const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  notes: { type: String }, // optional: e.g. "likes COD only"
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
