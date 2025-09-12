import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";
import {
  getPendingOrders,
  getInventory,
  getCampaigns,
} from "../services/dashboardService";

export default function Dashboard({ setIsSidebarOpen }) {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, inventoryData, campaignsData] = await Promise.all([
          getPendingOrders(),
          getInventory(),
          getCampaigns(),
        ]);

        // Ensure arrays
        setOrders(
          Array.isArray(ordersData) ? ordersData : ordersData.orders || []
        );
        setInventory(
          Array.isArray(inventoryData)
            ? inventoryData
            : inventoryData.products || []
        );
        setCampaigns(
          Array.isArray(campaignsData)
            ? campaignsData
            : campaignsData.campaigns || []
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  // Get today's date in YYYY-MM-DD format
const todayString = new Date().toISOString().split("T")[0];

const todaysOrders = Array.isArray(orders)
  ? orders.filter((o) => {
      const orderDate = new Date(o.createdAt).toISOString().split("T")[0];
      return orderDate === todayString;
    })
  : [];

const todaysSale = todaysOrders.reduce(
  (sum, o) => sum + (o.price || 0) * (o.quantity || 1),
  0
);


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome 👋</h1>
        </div>
        <div className="flex justify-around items-center">
          <Profile />
          <NotificationBell />
        </div>
      </div>

      {/* Today's Sales (Example: count total orders * price) */}
      <div className="bg-white shadow-sm rounded-xl p-4 mb-6">
        <h2 className="text-sm text-gray-500">Today's Sales</h2>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          ₹{todaysSale}
        </p>
        <p className="text-sm text-gray-600 mt-1">
        {todaysOrders.length} order{todaysOrders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Orders & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pending Orders */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Pending Orders
            </h2>
            <Link
              to="/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              See all
            </Link>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {orders.length === 0 ? (
              <p className="text-gray-500">No pending orders.</p>
            ) : (
              orders.slice(0,3).map((o) => (
                <li key={o._id} className="flex justify-between">
                  <div>
                    <h2 className="font-medium">
                      {o.user?.name || "Customer"}
                    </h2>
                    <span className="text-sm">
                      {o.orderItems?.map((i) => i.name).join(", ")}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Inventory */}
        <div className="bg-white shadow-sm rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Inventory
            </h2>
            <Link
              to="/inventory"
              className="text-sm text-blue-600 hover:underline"
            >
              See all
            </Link>
          </div>
          <p className="text-3xl font-medium text-gray-800 mb-4">
            {inventory.length}
          </p>
          <ul className="space-y-1 text-gray-700 max-h-48 overflow-y-auto">
            {inventory.slice(0, 3).map((p) => (
              <li key={p._id} className="flex justify-between">
                <span>{p.name}</span> <span>{p.stock}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Marketing Planner */}
      <div className="bg-white shadow-sm rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Marketing Planner
          </h2>
          <Link
            to="/marketing"
            className="text-sm text-blue-600 hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-48 overflow-y-auto">
          {campaigns.length === 0 ? (
            <p className="text-gray-500">No campaigns planned.</p>
          ) : (
            campaigns.map((c) => (
              <div
                key={c._id}
                className="h-12 bg-blue-100 rounded-md flex items-center justify-center text-xs text-blue-800"
              >
                {c.title}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
