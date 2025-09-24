// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react"; // import icons
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "",phone:"", password: "",timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const validateForm = () => {
    let newErrors = {};

    // name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 chars, include 1 uppercase, 1 lowercase, 1 number & 1 special char";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // stop if validation fails
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      toast.success(res.data.message || "Registered successfully! 🎉");
      setForm({ name: "", email: "", phone: "" , password: "" });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side (Brand/Illustration) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-pink-500 items-center justify-center text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-extrabold mb-4">Welcome 👋</h1>
          <p className="text-lg opacity-90">
            Create your account and start managing your business with a smart
            dashboard, orders tracking, and instant notifications.
          </p>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create an Account
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Fill in your details to get started 🚀
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-pink-500"
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-pink-500"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone No
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-pink-500"
                }`}
                placeholder="91********"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-pink-500"
                }`}
                placeholder="••••••••"
              />
              <button
              type="button"
              className="absolute right-3 bottom-4 text-black"
              onClick={() => setShowPassword(!showPassword)}
            >{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg cursor-pointer"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
