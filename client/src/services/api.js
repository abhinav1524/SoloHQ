// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust to your backend URL
  withCredentials: true, // if you’re using sessions/cookies
});

export default api;
