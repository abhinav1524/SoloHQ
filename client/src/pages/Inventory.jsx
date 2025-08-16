// src/components/InventoryTable.jsx
import React, { useState } from "react";

const InventoryTable = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", stock: 10 },
    { id: 2, name: "Product B", stock: 4 },
    { id: 3, name: "Product C", stock: 15 },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", stock: "" });
  const [editingProductId, setEditingProductId] = useState(null);

  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.stock === "") return;
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: newProduct.name,
        stock: parseInt(newProduct.stock, 10),
      },
    ]);
    setNewProduct({ name: "", stock: "" });
  };

  const handleEditProduct = (id) => {
    setEditingProductId(id);
    const productToEdit = products.find((p) => p.id === id);
    setNewProduct({ name: productToEdit.name, stock: productToEdit.stock });
  };

  const handleSaveEdit = () => {
    setProducts(
      products.map((p) =>
        p.id === editingProductId
          ? { ...p, name: newProduct.name, stock: parseInt(newProduct.stock, 10) }
          : p
      )
    );
    setEditingProductId(null);
    setNewProduct({ name: "", stock: "" });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Inventory</h2>

      {/* Add/Edit Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 rounded w-1/2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          className="border p-2 rounded w-1/4"
        />
        {editingProductId ? (
          <button
            onClick={handleSaveEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td
                className={`p-2 border ${
                  p.stock < 5 ? "text-red-500 font-bold" : ""
                }`}
              >
                {p.stock}
              </td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEditProduct(p.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
