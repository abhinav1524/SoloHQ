import api from "./api";

// Get all orders
export const getCustomers = async () => {
  const res = await api.get("/customers");
//   console.log(res)
  return res.data;
};
// ✅ Get single customer by ID
export const getCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

// ✅ Add new customer
export const addCustomer = async (customerData) => {
  const res = await api.post("/customers", customerData);
  return res.data;
};

// ✅ Update customer
export const updateCustomer = async (id, customerData) => {
  const res = await api.put(`/customers/${id}`, customerData);
  return res.data;
};

// ✅ Delete customer
export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};