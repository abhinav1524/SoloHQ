import api from "./api";

// Send forgot password email
export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data; // return response data for toast messages
};

// Reset password using token
export const resetPassword = async (token, newPassword) => {
  const res = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
  return res.data; // return response data for toast messages
};

// ✅ Google login
export const googleLogin = async (googleToken) => {
  const res = await api.post(
    "/auth/google",
    { token: googleToken },
    { withCredentials: true } // ensure cookie gets set
  );
  return res.data; 
};