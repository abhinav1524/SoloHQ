import { useState, useEffect } from "react";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerServices";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  // Handle Add
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await addCustomer({ name, phone, email, address });
      // console.log(res);
      setCustomers([res.customer, ...customers]);
      resetForm();
      setShowAddForm(false);
      toast.success(res.message || "customer add successfully! 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "unable to add customer ! ❌");
      console.error("Error adding customer:", error);
    }
  };

// Handle Edit
const handleEditCustomer = async (e) => {
  e.preventDefault();
  try {
    const res = await updateCustomer(editingCustomer._id, {
      name,
      phone,
      email,
      address,
    });
    // console.log(res); // res should be { message, customer }

    // Update only the customer in state
    setCustomers(
      customers.map((cust) =>
        cust._id === editingCustomer._id ? res.customer : cust
      )
    );

    resetForm();
    setShowEditForm(false);

    // Show toast message
    toast.success(res.message || "Customer updated successfully! 🎉");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to update customer! ❌"
    );
    console.error("Error editing customer:", error);
  }
};

// Handle Delete
const handleDeleteCustomer = async (id) => {
  if (!window.confirm("Are you sure you want to delete this customer?"))
    return;
  try {
    const res = await deleteCustomer(id); // make sure deleteCustomer returns { message }

    // Remove customer from state
    setCustomers(customers.filter((cust) => cust._id !== id));

    // Show toast message
    toast.success(res.message || "Customer deleted successfully! 🎉");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to delete customer! ❌"
    );
    console.error("Error deleting customer:", error);
  }
};

  // Reset form
  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setEditingCustomer(null);
  };

  // Search filter
  const filteredCustomers = customers.filter(
  (c) =>
    (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (c.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (c.phone || "").includes(searchQuery) ||
    (c.address?.toLowerCase() || "").includes(searchQuery.toLowerCase())
);


  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Add New Customer
        </button>
        <input
          type="text"
          placeholder="Search by name, email, phone, address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-lg w-1/3"
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">customer Id</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((cust) => (
              <tr key={cust._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{cust._id}</td>
                <td className="p-3">{cust.name}</td>
                <td className="p-3">{cust.phone}</td>
                <td className="p-3">{cust.email}</td>
                <td className="p-3">{cust.address}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCustomer(cust);
                      setName(cust.name);
                      setPhone(cust.phone);
                      setEmail(cust.email);
                      setAddress(cust.address);
                      setShowEditForm(true);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(cust._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
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

      {/* Add Modal */}
      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <h2 className="text-lg font-semibold">Add Customer</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full border rounded px-3 py-2"
            required
          />
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
              Add
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditForm} onClose={() => setShowEditForm(false)}>
        <form onSubmit={handleEditCustomer} className="space-y-4">
          <h2 className="text-lg font-semibold">Edit Customer</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full border rounded px-3 py-2"
            required
          />
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
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
