import { useState,useEffect } from "react";
import Modal from "../components/Modal";
import { addNotification } from "../features/NotificationSlice"; 
import { useDispatch } from "react-redux";
const Orders = () => {
    const dispatch = useDispatch();

  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", product: "T-Shirt", date: "2025-08-10", status: "Pending" },
    { id: 2, customer: "Jane Smith", product: "Shoes", date: "2025-08-09", status: "Completed" },
    { id: 3, customer: "Mike Ross", product: "Cap", date: "2025-08-11", status: "Pending" },
    { id: 4, customer: "Rachel Zane", product: "Bag", date: "2025-08-08", status: "Cancelled" },
  ]);

  const [filter, setFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for new order
  const [newCustomer, setNewCustomer] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10)); // default to today
  const [newStatus, setNewStatus] = useState("Pending");

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const handleAddOrder = (e) => {
    e.preventDefault();

    if (!newCustomer.trim() || !newProduct.trim()) {
      alert("Please fill customer and product fields.");
      return;
    }

    const generateRandomId = () => {
    return Math.floor(1000 + Math.random() * 90000); // 4 to 5 digit number
  };
    // Auto-generate ID: max existing ID + 1
     let randomOrderId;
  do {
    randomOrderId = generateRandomId();
  } while (orders.some(o => o.id === randomOrderId));

  const uniqueId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const newOrder = {
      id:uniqueId,
      orderId: randomOrderId,
      customer: newCustomer.trim(),
      product: newProduct.trim(),
      date: newDate,
      status: newStatus,
    };

    setOrders([newOrder, ...orders]);

    // Reset form
    setNewCustomer("");
    setNewProduct("");
    setNewDate(new Date().toISOString().slice(0, 10));
    setNewStatus("Pending");
    setShowAddForm(false);
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const completedCount = orders.filter(o => o.status === "Completed").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Pending Orders</h3>
          <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Completed Orders</h3>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Cancelled Orders</h3>
          <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
        </div>
      </div>

      {/* Add New Order Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 cursor-pointer"
        >
          Add New Order
        </button>
      </div>
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <form onSubmit={handleAddOrder} className="space-y-4">
          {/* your form fields here (customer, product, date, status) */}
          <div>
            <label className="block mb-1 font-medium">Customer</label>
            <input
              type="text"
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              placeholder="Customer Name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Product</label>
            <input
              type="text"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              placeholder="Product Name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Order
            </button>
          </div>
        </form>
      </Modal>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Pending", "Completed", "Cancelled"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded font-medium shadow-sm ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Order Id</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3">#{order.orderId}</td>
                <td className="p-3 capitalize">{order.customer}</td>
                <td className="p-3 capitalize">{order.product}</td>
                <td className="p-3">{order.date}</td>
                <td
                  className={`p-3 font-semibold ${
                    order.status === "Pending"
                      ? "text-orange-600"
                      : order.status === "Completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="p-3 flex gap-2">
                   {order.status !== "Completed" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Pending")}
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Pending
                    </button>
                  )}
                  {order.status !== "Completed" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Completed")}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Complete
                    </button>
                  )}
                  {order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleStatusChange(order.id, "Cancelled")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
