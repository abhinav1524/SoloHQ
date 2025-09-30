// userSchema.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const subscriptionSchema = new mongoose.Schema({
  planName: String,             // e.g. "Basic-1M"
  price: Number,                // e.g. 199
  durationInMonths: Number,     // e.g. 1
  features: [String],           // ["AI Suggestions", "WhatsApp Alerts"]
  startDate: Date,              // when user subscribed
  endDate: Date,                // when subscription ends
  status: { type: String, enum: ["active", "expired"], default: "active" },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  password: String,
  role: { type: String, default: "user" },
  subscription: subscriptionSchema,  // <-- NEW SUBDOCUMENT
  trialEndDate: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days trial
    },
  },
  profilePic: { type: String, default: "" },
  profilePicPublicId: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  googleId: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  otpSecret: String,
  createdAt: { type: Date, default: Date.now },
  timezone: { type: String, default: "UTC" },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
