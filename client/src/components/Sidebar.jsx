import { Home, ShoppingBag, Package, Megaphone, X,CreditCard,TrendingUp ,Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth(); 
  return (
    <>
      {/* Overlay - only for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-white w-64 min-h-screen p-4 fixed md:static top-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:block`}
      >
        {/* Close button - visible only on mobile */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h1 className="text-2xl font-bold">SoloHQ</h1>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} className="text-gray-600 hover:text-gray-900" />
          </button>
        </div>

        {/* Title - visible only on desktop */}
        <h1 className="text-2xl font-bold mb-8 hidden md:block">SoloHQ</h1>

        <nav className="space-y-4">
          <Link to="/" className="flex items-center space-x-2 text-blue-600">
            <Home size={20} /> <span>Dashboard</span>
          </Link>
          <Link to="/orders" className="flex items-center space-x-2 text-gray-600">
            <ShoppingBag size={20} /> <span>Orders</span>
          </Link>
          <Link to="/inventory" className="flex items-center space-x-2 text-gray-600">
            <Package size={20} /> <span>Inventory</span>
          </Link>
          <Link to="/customer" className="flex items-center space-x-2 text-gray-600">
            <Package size={20} /> <span>Customers</span>
          </Link>
          <Link to="/marketing" className="flex items-center space-x-2 text-gray-600">
            <Megaphone size={20} /> <span>Marketing</span>
          </Link>
          <Link to="/sales" className="flex items-center space-x-2 text-gray-600">
            <TrendingUp size={20} /> <span>Sales</span>
          </Link>
          <Link to="/generate-captions" className="flex items-center space-x-2 text-gray-600">
            <Cpu size={20}/> <span>Gen Ai Captions</span>
          </Link>
         {user?.role === "admin" && (
          <Link
            to="/subscription"
            className="flex items-center space-x-2 text-gray-600"
          >
            <CreditCard size={20} />
            <span>Subscription</span>
          </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
