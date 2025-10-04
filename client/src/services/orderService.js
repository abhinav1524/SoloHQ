// src/services/orderService.js
import api from "./api";

// Get all orders
export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

// Create new order
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

// Update an existing order
export const updateOrder = async (orderId, updatedData) => {
  const res = await api.put(`/orders/${orderId}`, updatedData);
  return res.data;
};

// update the status of the order 
export const updateOrderStatus = async (orderId,data) => {
  const res = await api.put(`orders/status/${orderId}`,data);
  console.log(res.data);
  return res.data;
};
// Delete an order
export const deleteOrder = async (orderId) => {
  const res = await api.delete(`/orders/${orderId}`);
  return res.data;
};
