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
import PageNotFound from "./pages/PageNotFound";
import {useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Subscription from "./pages/Subscription";
import { Toaster } from "react-hot-toast";
import Sales from "./pages/Sales";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import GenerateCaption from "./pages/GenerateCaption";
import Plans from "./pages/Plans";
import BillingInfo from "./pages/Billing";
import CompleteProfile from "./pages/CompleteProfile";
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
          <div className="flex-1 min-w-0 py-4 px-2">
            <Header setIsSidebarOpen={setIsSidebarOpen} title="Welcome" user={user} /> 
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute> } />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute><MarketingPlanner /></ProtectedRoute>} />
              <Route path="/customer" element={<ProtectedRoute><Customer/></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><Sales/></ProtectedRoute>} />
              <Route path="/generate-captions" element={<ProtectedRoute><GenerateCaption/></ProtectedRoute>} />
              <Route path="/plans" element={<ProtectedRoute><Plans/></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><BillingInfo/></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute allowedRoles={["admin"]}><Subscription/></ProtectedRoute>} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        // Routes without Sidebar (guest only)
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/complete-profile" element={<CompleteProfile />}  />
          {/* Default redirect if not logged in */}
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
