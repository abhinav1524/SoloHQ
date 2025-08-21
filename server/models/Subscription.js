import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      enum: ["Basic-1M", "Pro-6M", "Premium-12M"], // naming convention
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

export default mongoose.model("Subscription", subscriptionSchema);
