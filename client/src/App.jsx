import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import MarketingPlanner from "./pages/MarketingPlanner";
import FocusMode from "./pages/FocusMode";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import NotificationWatcher from "./components/NotificationWatcher";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <Router>
      <NotificationWatcher />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard setIsSidebarOpen={setIsSidebarOpen} />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/marketing" element={<MarketingPlanner />} />
            <Route path="/focus" element={<FocusMode />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
