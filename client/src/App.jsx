import { BrowserRouter as Router, Routes, Route,Navigate  } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import MarketingPlanner from "./pages/MarketingPlanner";
import FocusMode from "./pages/FocusMode";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Customer from "./pages/Customers";
import {useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      {user ? (
        // Layout with Sidebar (only for logged-in users)
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard setIsSidebarOpen={setIsSidebarOpen} /></ProtectedRoute> } />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute><MarketingPlanner /></ProtectedRoute>} />
              <Route path="/customer" element={<ProtectedRoute><Customer/></ProtectedRoute>} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        // Routes without Sidebar (guest only)
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Default redirect if not logged in */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
