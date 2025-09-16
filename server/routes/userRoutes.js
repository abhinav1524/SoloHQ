const express = require("express");
const router = express.Router();
const uploadProfilePic  = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/profile-pic",protect, upload.single("image"), uploadProfilePic);

module.exports = router;
