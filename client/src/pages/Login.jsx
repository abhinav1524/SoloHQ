// src/pages/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // import icons
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);   
    // console.log("Login submitted:", form);
    try {
        const res =await api.post("/auth/login",form)
        setUser(res.data); 
        navigate("/")
        toast.success(res.data.message || "login successfully! 🎉");
    } catch (error) {
        toast.error(error.response?.data?.message || "login failed ❌");
        // console.log("error",error)
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-200 text-center mb-6">
          Please sign in to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 mt-1 rounded-xl bg-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-gray-200 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-white"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-sm text-gray-200 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-white"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-4 text-white"
              onClick={() => setShowPassword(!showPassword)}
            >{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg"
          >
            {loading ? "logging in..." : "Sign In"}
          </button>
        </form>
        {/* forgot password route */}
        <div className="mt-6 text-center text-gray-300 text-sm">
          <Link to="/forgot-password">forgot password</Link>
        </div>
        {/* Footer Links */}
        <div className="mt-4 text-center text-gray-300 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-white font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
