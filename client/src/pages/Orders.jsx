import { useState, useEffect } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderService";
import { getCustomers } from "../services/customerServices";
import { getProducts } from "../services/inventoryService";
import Modal from "../components/Modal";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Form state
  const [newId, setNewId] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [newPrice, setNewPrice] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newDate, setNewDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [newStatus, setNewStatus] = useState("pending");

  const [editQuantity, setEditQuantity] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editProduct, setEditProduct] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Fetch dropdown data from services
  const fetchDropdownData = async () => {
    try {
      const [custData, prodData] = await Promise.all([
        getCustomers(),
        getProducts(),
      ]);
      setCustomers(custData);
      setProducts(prodData);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      setOrders(data);
    }
    fetchOrders();
    fetchDropdownData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Add Order
  const handleAddOrder = async (e) => {
    e.preventDefault();

    const quantityNumber = Number(newQuantity);
    const newPriceNumber = Number(newPrice);

    if (
      !newId.trim() ||
      !newProduct.trim() ||
      !quantityNumber ||
      !newPriceNumber ||
      quantityNumber <= 0
    ) {
      toast.error("All fields should be filled correctly ❌");
      return;
    }

    try {
      const selectedProduct = products.find((p) => p._id === newProduct);
      // console.log(selectedProduct)
      const newOrder = await createOrder({
        customerId: newId,
        productId: newProduct,
        quantity: quantityNumber,
        price: newPriceNumber,
        date: newDate,
        status: newStatus,
      });

      setOrders([newOrder, ...orders]);

      // Reset form
      setNewId("");
      setNewProduct("");
      setNewQuantity("1");
      setNewPrice("");
      setNewDate(new Date().toISOString().slice(0, 10));
      setNewStatus("pending");
      setShowAddForm(false);
      // ✅ Check if the backend sent a feature restriction message
      if (newOrder.featureMessage) {
        setTimeout(() => {
          toast.error(newOrder.featureMessage); // show warning
        }, 2000);
        toast.success("Order added successfully 🎉");
      } else {
        toast.success("Order added successfully 🎉");
      }
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error(error.response?.data?.message || "Unable to add order ❌");
    }
  };

  // Edit Order
  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditProduct(order.product);
    setEditQuantity(order.quantity);
    setEditPrice(order.price);
    setEditDate(formatDateForInput(order.date));
    setEditStatus(order.status);
    setShowEditForm(true);
  };

  const handleEditOrder = async (e) => {
    e.preventDefault();

    const quantityNumber = Number(editQuantity);
    const editPriceNumber = Number(editPrice);

    if (!editProduct.trim() || !quantityNumber || !editPriceNumber) {
      toast.error("All fields should be filled correctly ❌");
      return;
    }

    try {
      const selectedProduct = products.find((p) => p._id === editProduct);

      const updated = await updateOrder(editingOrder._id, {
        productId: editProduct,
        quantity: quantityNumber,
        price: editPriceNumber,
        date: editDate,
        status: editStatus,
      });

      setOrders(
        orders.map((order) =>
          order._id === editingOrder._id ? updated : order
        )
      );

      setShowEditForm(false);
      toast.success("Order updated successfully 🎉");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data?.message || "Unable to update order ❌");
    }
  };

  // Delete Order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order._id !== id));
      toast.success("Order deleted successfully 🗑️");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Unable to delete order ❌");
    }
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancel").length;

  // Filter + Search + Pagination
  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const searchedOrders = filteredOrders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order._id.toLowerCase().includes(query) ||
      order.customerId?.name?.toLowerCase().includes(query) ||
      order.productId?.name?.toLowerCase().includes(query)
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
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4">
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
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg"
        />
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <form onSubmit={handleAddOrder} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Customer</label>
            <select
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((cust) => (
                <option key={cust._id} value={cust._id}>
                  {cust.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Product</label>
            <select
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Product</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              placeholder="Product Quantity"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancel">Cancelled</option>
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
            <select
              value={editProduct}
              onChange={(e) => setEditProduct(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select Product</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancel">Cancelled</option>
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
      <div className="flex gap-2 mb-4 overflow-x-auto flex-nowrap whitespace-nowrap">
        {["all", "pending", "completed", "cancel"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded font-medium shadow-sm ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <span className="capitalize">{status}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded shadow min-w-0">
        <table className="min-w-[800px] sm:min-w-[1000px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Order Id</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-3">#{order._id}</td>
                <td className="p-3 capitalize">{order.customerId?.name}</td>
                <td className="p-3 capitalize">{order.productId?.name}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{order.price}</td>
                <td className="p-3">{order.date}</td>
                <td
                  className={`p-3 font-semibold ${
                    order.status === "pending"
                      ? "text-orange-600"
                      : order.status === "completed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.status}
                </td>
                <td className="p-3 flex gap-2 items-center">
                  {/* Status buttons */}
                  {order.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "pending")}
                      className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Pending
                    </button>
                  )}
                  {order.status !== "completed" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "completed")}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Complete
                    </button>
                  )}
                  {order.status !== "cancel" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "cancel")}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Edit & Delete icons */}
                  <button
                    onClick={() => handleEditClick(order)}
                    className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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
