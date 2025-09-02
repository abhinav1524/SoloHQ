const express = require("express");
const { register, login,validateLogin,validateRegister } = require("../controllers/authController");
const loginLimiter =require("../middleware/loginLimiter");
const router = express.Router();

router.post("/register",validateRegister, register);
router.post("/login",loginLimiter,validateLogin, login);

module.exports = router;
