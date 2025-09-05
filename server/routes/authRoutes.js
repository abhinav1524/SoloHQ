const express = require("express");
const { register, login,validateLogin,validateRegister } = require("../controllers/authController");
const loginLimiter =require("../middleware/loginLimiter");
const {protect} =require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register",validateRegister, register);
router.post("/login",loginLimiter,validateLogin, login);

//cheking the user is authenticate or not when page get relaod 
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

// routes for logout the user 
// routes/authRoutes.js
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
