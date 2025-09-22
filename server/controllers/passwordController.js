const crypto = require("crypto");
const User = require("../models/Users");
const sendEmail = require("../utils/sendEmail"); // create a small email utility

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate token
  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  // Send email
  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const message = `Click this link to reset your password: ${resetUrl}`;

  try {
    await sendEmail(user.email, "Password Reset", message);
    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email could not be sent" });
  }
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = password; // ⚠️ hash the password before saving in production
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.status(200).json({ message: "Password has been reset successfully" });
};

module.exports={forgotPassword,resetPassword}