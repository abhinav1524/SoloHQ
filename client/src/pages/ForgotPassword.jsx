import { useState } from "react";
import { toast } from "react-hot-toast";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ for button state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // disable button
    try {
      const res = await forgotPassword(email);
      toast.success(res.message || "Reset link sent to your email!"); // ✅ toast notification
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
      <h2 className="text-xl font-bold mb-4 text-center text-white">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 outline-0 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading} // ✅ disable while loading
          className={`w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg${
            loading ? "opacity-50 cursor-not-allowed" : "hover:from-indigo-600 to-pink-500"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      </div>
    </div>
  );
}
