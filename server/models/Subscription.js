const mongoose= require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      enum: ["Basic", "Pro", "Premium"], // naming convention
    },
    price: {
      type: Number,
      required: true,
    },
    durationInMonths: {
      type: Number,
      required: true,
    },
    features: {
      type: [String], // e.g. ["Whatsapp Alerts", "AI Captions"]
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
