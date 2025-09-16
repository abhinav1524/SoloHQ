const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

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
    });
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

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


// Logout → clear cookie
const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { register, login, logout, validateRegister, validateLogin };
