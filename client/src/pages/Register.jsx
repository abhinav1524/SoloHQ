// src/pages/Register.jsx
import { useState } from "react";
import {Link} from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      alert(res.data.message || "Registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side (Brand/Illustration) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 items-center justify-center text-white p-12">
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
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
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