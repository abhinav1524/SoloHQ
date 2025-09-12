const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  subscription: {
    type: String,
    enum: ["free", "monthly", "six-month", "yearly"],
    default: "free",
  },
  googleId: { type: String }, // For Google OAuth
  twoFactorEnabled: { type: Boolean, default: false }, // 2FA flag
  otpSecret: { type: String }, // Temporary OTP for 2FA
  createdAt: { type: Date, default: Date.now },
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
