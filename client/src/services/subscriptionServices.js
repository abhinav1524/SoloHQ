// src/services/orderService.js
import api from "./api";

// Get all orders
export const getSubscriptions = async () => {
  const res = await api.get("/subscriptions");
  return res.data;
};

// Create new order
export const createSubscription = async (orderData) => {
  const res = await api.post("/subscriptions/", orderData);
  return res.data;
};

// Update an existing order
export const updateSubscription = async (orderId, updatedData) => {
  const res = await api.put(`/subscriptions/${orderId}`, updatedData);
  return res.data;
};

// Delete an order
export const deleteSubscription = async (orderId) => {
  const res = await api.delete(`/subscriptions/${orderId}`);
  return res.data;
};
