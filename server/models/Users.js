const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  password: String,
  role: { type: String, default: "user" },
  subscription: {
    type: String,
    enum: ["trial", "free", "monthly", "six-month", "yearly"],
    default: "trial",
  },
  trialEndDate: {
  type: Date,
  default: function () {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // ✅ 7 days from signup
  },
},
  planEndDate: { type: Date },
  profilePic: {
    type: String, // store the URL of the profile image
    default: "", // optional, user can skip uploading
  },
  profilePicPublicId: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  googleId: { type: String }, // For Google OAuth
  twoFactorEnabled: { type: Boolean, default: false }, // 2FA flag
  otpSecret: { type: String }, // Temporary OTP for 2FA
  createdAt: { type: Date, default: Date.now },
  timezone: { type: String, default: "UTC" }
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
