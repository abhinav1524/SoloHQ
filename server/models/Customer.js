const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // business owner
      required: true,
    },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  address: { type: String },
  notes: { type: String }, // optional: e.g. "likes COD only"
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
