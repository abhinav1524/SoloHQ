import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize local profilePic from user object
  useEffect(() => {
    if (user && user.profilePic) {
      setProfilePic(user.profilePic);
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Optional: show local preview
    const imageUrl = URL.createObjectURL(file);
    setProfilePic(imageUrl);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload to backend
      const res = await api.post("/user/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update both local state and user context
      setProfilePic(res.data.profilePic);
      setUser((prev) => ({
        ...prev,
        profilePic: res.data.profilePic,
      }));
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null); // clears context
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="relative">
      {/* Profile Picture Button */}
      <div
        className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden cursor-pointer mr-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {profilePic ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300"></div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
          <div className="px-4 py-2 text-gray-700 font-semibold border-b">
            {user?.name || "Unknown User"}
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Upload Picture
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
