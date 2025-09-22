import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { resetPassword } from "../services/authService";
import { Eye, EyeOff } from "lucide-react"; // import icons

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ for button state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true); // disable button

    try {
      const res = await resetPassword(token, password);
      toast.success(res.message || "Password reset successfully!"); // ✅ toast notification
      navigate("/login"); // redirect to login after success
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // enable button after request
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center mx-auto p-6  bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow rounded">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold mb-4 text-center text-white">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-white">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 outline-0 text-white relative"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-10 top-30 text-white"
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
        <div>
          <label className="block mb-1 text-white">Confirm Password</label>
          <input
            type={showConfirmPassword  ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 outline-0 text-white relative"
          />
           <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword )}
            className="absolute right-10 bottom-27 text-white"
            >
            {showConfirmPassword  ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
        <button
          type="submit"
          disabled={loading} // ✅ disable while loading
          className={`w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-indigo-600 to-pink-500"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      </div>
    </div>
  );
}
