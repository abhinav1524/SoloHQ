import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getSales } from "../services/salesServices";

export default function Sales() {
  const [salesData, setSalesData] = useState(null);
  const [filter, setFilter] = useState("monthly");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSales();
        setSalesData(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
    fetchSales();
  }, []);

  if (!salesData) return <p>Loading...</p>;

  const filterData = () => {
    if (!salesData) return [];

    const now = new Date();
    let startDate;

    if (filter === "daily") {
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "weekly") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === "monthly") {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
    }

    return salesData.salesTrend.filter(
      (item) => new Date(item.date) >= startDate
    );
  };

  return (
    <div className="p-4 space-y-6 bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Sales Overview</h2>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-500">Total Revenue</p>
          <p className="text-lg font-bold">₹{salesData.totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-500">Units Sold</p>
          <p className="text-lg font-bold">{salesData.unitsSold}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-500">Avg Order Value</p>
          <p className="text-lg font-bold">₹{salesData.avgOrderValue}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <p className="text-gray-500">Best Seller</p>
          <p className="text-lg font-bold">{salesData.bestSeller?.name}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["daily", "weekly", "monthly"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-2xl ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            } cursor-pointer`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-2">Sales Trend</h3>
        <div className="w-full h-64 sm:h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filterData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Breakdown */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-2">Product Breakdown</h3>
        <ul>
          {salesData.productBreakdown.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b py-2 text-sm sm:text-base"
            >
              <span>{item.name}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
