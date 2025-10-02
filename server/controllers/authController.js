const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const loginLimiter = require("../middleware/loginLimiter");
// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Validation middleware for register
const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
    .escape(),

  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),
];

// Validation middleware for login
const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Helper function to send token in cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  // Set cookie options
  const options = {
    httpOnly: true, // prevents JS access (XSS protection)
    secure: process.env.NODE_ENV === "production", // only send cookie over https in production
    sameSite: "lax", // protect against CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res
    .status(statusCode)
    .cookie("token", token, options) // <-- set cookie
    .json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      profilePic: user.profilePic || null,
      profilePicPublicId: user.profilePicPublicId || null,
      role:user.role
    });
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email,phone, password,timezone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email,phone, password,isProfileComplete:true,timezone });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Reset rate limit for this IP
    //    if (loginLimiter && loginLimiter.store && typeof loginLimiter.store.resetKey === "function") {
    //   loginLimiter.store.resetKey(req.ip, (err) => {
    //     if (err) console.error("Failed to reset rate limit key:", err);
    //   });
    // }
      sendTokenResponse(user, 200, res);
      // reset limiter after success
      if (req.rateLimit) {
        req.rateLimit.resetKey(req.ip);
      }

      return; // ✅ stop execution after response
    } else {
      return res.status(401).json({ message: "Invalid email or password" }); // ✅ add return
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" }); // ✅ add return
  }
};

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Case: Already exists with Google → check if profile complete
      if (!user.isProfileComplete) {
        return res.status(200).json({
          success: true,
          message: "Additional info required",
          tempUserId: user._id,
          name: user.name,
          email: user.email,
        });
      }

      // Profile complete → log them in
      return sendTokenResponse(user, 200, res);
    }

    // New Google user → create with placeholder info
    user = await User.create({
      name,
      email,
      phone: null,               // will be filled later
      password: null,            // user can set password later
    });

    res.status(201).json({
      success: true,
      message: "Additional info required",
      tempUserId: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

// Complete Profile
const completeProfile = async (req, res) => {
  try {
    const { tempUserId, phone, password } = req.body;
    if (!tempUserId || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(tempUserId);
    if (!user) return res.status(404).json({ message: "User not found" });


    user.phone = phone;
    user.password = password;
    user.isProfileComplete = true;

    await user.save();

    // Now log the user in
    return sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Logout → clear cookie
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { register, login, logout,googleLogin ,completeProfile, validateRegister, validateLogin };
