const cloudinary = require("cloudinary");
const User = require("../models/Users");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadProfilePic = async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Fetch user
    const user = await User.findById(req.user._id);

    // Delete old image if it exists
    if (user.profilePicPublicId) {
      await cloudinary.v2.uploader.destroy(user.profilePicPublicId);
    }

    // Upload new image
    const result = await cloudinary.v2.uploader.upload(fileBase64, {
      folder: "profile_pics",
      width: 150,
      height: 150,
      crop: "fill",
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        profilePic: result.secure_url,
        profilePicPublicId: result.public_id
      },
      { new: true }
    );

    res.json({ message: "Profile picture updated", profilePic: updatedUser.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};

module.exports = uploadProfilePic;
