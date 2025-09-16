// src/pages/Inventory.jsx
import { useState, useEffect } from "react";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/inventoryService";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Fetch Iventory Products
  useEffect(() => {
    getInventoryProducts();
  }, []);
  const getInventoryProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setStock("");
    setCategory("");
    setBrand("");
    setEditingProduct(null);
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        category,
        brand,
      };
      const res = await addProduct(newProduct);
      setProducts([res, ...products]);
      resetForm();
      setShowAddForm(false);
      toast.success("Product added in inventory successfully! 🎉");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "unable to add product ! ❌"
      );
      console.error("Error adding product:", error);
    }
  };

  // Edit product
const handleEditProduct = async (e) => {
  e.preventDefault();
  try {
    const updatedProduct = {
      name,
      description,
      price: parseFloat(price),   // ✅ fix
      stock: parseInt(stock, 10), // ✅ fix
      category,
      brand,
    };

    const res = await updateProduct(editingProduct._id, updatedProduct);

    setProducts(
      products.map((p) => (p._id === editingProduct._id ? res : p))
    );

    resetForm();
    setShowEditForm(false);
    toast.success("Product updated successfully! 🎉");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to update product ❌"
    );
    console.error("Error updating product:", error);
  }
};

  // Delete product
const handleDeleteProduct = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?"))
    return;
  try {
    await deleteProduct(id);
    setProducts(products.filter((p) => p._id !== id)); // ✅ match backend _id
    toast.success("Product deleted successfully! 🎉");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to delete product ❌"
    );
    console.error("Error deleting product:", error);
  }
};


  // Search filter
  const filteredProducts = products.filter(
    (p) =>
      (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      String(p.id).includes(searchQuery)
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Add New Product
        </button>
        <input
          type="text"
          placeholder="Search by ID or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg"
        />
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Product ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p._id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3">{p.price}</td>
                <td
                  className={`p-3 ${
                    p.stock < 5 ? "text-red-500 font-bold" : ""
                  }`}
                >
                  {p.stock}
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.brand}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setName(p.name);
                      setDescription(p.description);
                      setPrice(p.price);
                      setStock(p.stock);
                      setCategory(p.category);
                      setBrand(p.brand);
                      setShowEditForm(true);
                    }}
                    className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Trash2 size={18} />
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
        <form onSubmit={handleAddProduct} className="space-y-4">
          <h2 className="text-lg font-semibold">Add Product</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Product Price"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Product Category"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Product Brand"
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
        <form onSubmit={handleEditProduct} className="space-y-4">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Product Price"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Product Category"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Product Brand"
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

export default Inventory;
