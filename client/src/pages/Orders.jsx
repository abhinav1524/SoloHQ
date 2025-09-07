import { useState, useEffect } from "react";
import { getOrders } from "../services/orderService";
import Modal from "../components/Modal";
import { Edit, Trash2 } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Form state
  const [newQuantity, setNewQuantity] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newDate, setNewDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [newStatus, setNewStatus] = useState("Pending");

  const [editQuantity, setEditQuantity] = useState("");
  const [editProduct, setEditProduct] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Or when loading order data into edit modal

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Add Order
  const handleAddOrder = (e) => {
    e.preventDefault();
    const quantityNumber = Number(newQuantity); // convert here
    if (!newProduct.trim() || !quantityNumber || quantityNumber <= 0) {
      alert("Please fill product and quantity correctly.");
      return;
    }

    const newOrder = {
      _id: Math.random().toString(36).substr(2, 9),
      product: newProduct,
      quantity: quantityNumber,
      date: newDate,
      status: newStatus,
    };

    setOrders([newOrder, ...orders]);

    // Reset form
    setNewProduct("");
    setNewQuantity("");
    setNewDate(new Date().toISOString().slice(0, 10));
    setNewStatus("Pending");
    setShowAddForm(false);
  };

  // Edit Order
  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditProduct(order.product);
    setEditQuantity(order.quantity);
    setEditDate(formatDateForInput(order.date));
    setEditStatus(order.status);
    setShowEditForm(true);
  };

  const handleEditOrder = (e) => {
    e.preventDefault();
    const quantityNumber = Number(editQuantity);
    if (!editProduct.trim() || !quantityNumber || quantityNumber <= 0) {
      alert("Please fill product and quantity correctly.");
      return;
    }
    setOrders(
      orders.map((order) =>
        order._id === editingOrder._id
          ? {
              ...order,
              product: editProduct,
              quantity: quantityNumber,
              date: editDate,
              status: editStatus,
            }
          : order
      )
    );
    setShowEditForm(false);
  };

  // Delete Order
  const handleDeleteOrder = (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setOrders(orders.filter((order) => order._id !== id));
  };

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

  // Filter + Search + Pagination
  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const searchedOrders = filteredOrders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(query) ||
      order.customerId?._id?.toLowerCase().includes(query) ||
      order.product.toLowerCase().includes(query)
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = searchedOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(searchedOrders.length / ordersPerPage);

  function formatDateForInput(dateString) {
    // if dateString is in dd/MM/yyyy
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

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

      {/* Add New Order Button + Search */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 cursor-pointer"
        >
          Add New Order
        </button>
        <input
          type="text"
          placeholder="Search by Order ID, Customer ID, or Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-lg w-1/3"
        />
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <form onSubmit={handleAddOrder} className="space-y-4">
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
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="text"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              placeholder="Product Quantity"
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

      {/* Edit Modal */}
      <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
        <form onSubmit={handleEditOrder} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Product</label>
            <input
              type="text"
              value={editProduct}
              onChange={(e) => setEditProduct(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="text"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
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
              onClick={() => setShowEditForm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Pending", "Completed", "Cancelled"].map((status) => (
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
              <th className="p-3 text-left">Customer Id</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">#{order._id}</td>
                <td className="p-3 capitalize">{order.customerId?._id}</td>
                <td className="p-3 capitalize">{order.product}</td>
                <td className="p-3 capitalize">{order.quantity}</td>
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
                <td className="p-3 flex gap-2 items-center">
                  {/* Status buttons */}
                  {order.status !== "Completed" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Pending")}
                      className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Pending
                    </button>
                  )}
                  {order.status !== "Completed" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Completed")}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Complete
                    </button>
                  )}
                  {order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Cancelled")}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Edit & Delete icons */}
                  <button
                    onClick={() => handleEditClick(order)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
