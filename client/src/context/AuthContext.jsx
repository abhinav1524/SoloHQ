// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not checked yet
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch current user (backend should verify JWT cookie)
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me"); // <-- you need this endpoint
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
