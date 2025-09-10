import api from "./api"

export const getPendingOrders = async () => {
  const { data } = await api.get(`/orders/status?status=pending`);
  return data;
};

export const getInventory = async () => {
  const { data } = await api.get(`/inventory`);
  return data;
};

export const getCampaigns = async () => {
  const { data } = await api.get(`/campaigns`);
  return data;
};
