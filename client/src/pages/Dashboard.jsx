import Profile from "../components/Profile";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";
export default function Dashboard({ setIsSidebarOpen }) {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, I</h1>
        </div>
        <div className="flex justify-around items-center">
          <Profile/>
          <NotificationBell/>
        </div>
      </div>

      {/* Today's Sales */}
      <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
        <h2 className="text-sm text-gray-500">Today's Sales</h2>
        <p className="text-3xl font-bold text-gray-800 mt-1">₹1,240</p>
      </div>

      {/* Orders & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pending Orders */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Pending Orders</h2>
            <Link to="/ordres" className="text-sm text-blue-600 hover:underline">See all</Link>
          </div>
          <ul className="space-y-2">
            <li className="flex justify-between">
                <div>
                    <h2 className="font-medium">Aman Sharma</h2>
                    <span className="text-sm">Product A</span>
                </div>
              <span className="text-gray-500 text-sm">March 15</span>
            </li>
            <li className="flex justify-between">
                <div>
                    <h2 className="font-medium">Priya Singh</h2>
                    <span className="text-sm">Product B</span>
                </div>
              <span className="text-gray-500 text-sm">March 15</span>
            </li>
            <li className="flex justify-between">
                <div>
                    <h2 className="font-medium">Rahul Verma</h2>
                    <span className="text-sm">Product C</span>
                </div>
              <span className="text-gray-500 text-sm">March 14</span>
            </li>
          </ul>
        </div>

        {/* Inventory */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Inventory</h2>
          <p className="text-3xl font-medium text-gray-800 mb-4">20</p>
          <ul className="space-y-1 text-gray-700">
            <li className="flex justify-between"><span>Product A</span> <span>8</span> </li>
            <li className="flex justify-between"><span>Product B</span> <span>6</span></li>
            <li className="flex justify-between"><span>Product C</span> <span> 3</span></li>
          </ul>
        </div>
      </div>

      {/* Marketing Planner */}
      <div className="bg-white shadow-sm rounded-xl p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Marketing Planner</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

