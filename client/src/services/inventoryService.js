// src/services/inventoryService.jsx
import api from "./api";

// ✅ Get all products
export const getProducts = async () => {
  const res = await api.get("/inventory/"); 
  return res.data;
};

// ✅ Get single product by ID
export const getProductById = async (id) => {
  const res = await api.get(`/inventory/${id}`);
  return res.data;
};

// ✅ Add new product
export const addProduct = async (productData) => {
  const res = await api.post("/inventory/", productData);
  return res.data;
};

// ✅ Update product
export const updateProduct = async (id, productData) => {
  const res = await api.put(`/inventory/${id}`, productData);
  return res.data;
};

// ✅ Delete product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/inventory/${id}`);
  return res.data;
};
