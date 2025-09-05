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
