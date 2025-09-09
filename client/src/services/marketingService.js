// src/services/marketingService.js
import api from "./api";

// Get all campaigns for current user
export const getCampaigns = async () => {
  const res = await api.get("/campaigns");
  return res.data;
};

// Get single campaign by id
export const getCampaignById = async (id) => {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
};

// Add a new campaign
// campaignData example:
// {
//   title: "Summer Sale",
//   description: "Promote new shirts",
//   channel: "Instagram",
//   startDate: "2025-09-10T00:00:00.000Z",
//   endDate: "2025-09-20T00:00:00.000Z"
// }
export const addCampaign = async (campaignData) => {
  const payload = {
    ...campaignData,
    // normalize date fields to ISO strings if provided as Date or string
    startDate: campaignData.startDate
      ? new Date(campaignData.startDate).toISOString()
      : undefined,
    endDate: campaignData.endDate
      ? new Date(campaignData.endDate).toISOString()
      : undefined,
  };

  const res = await api.post("/campaigns", payload);
  return res.data;
};

// Update existing campaign
export const updateCampaign = async (id, campaignData) => {
  const payload = {
    ...campaignData,
    startDate: campaignData.startDate
      ? new Date(campaignData.startDate).toISOString()
      : campaignData.startDate,
    endDate: campaignData.endDate
      ? new Date(campaignData.endDate).toISOString()
      : campaignData.endDate,
  };

  const res = await api.put(`/campaigns/${id}`, payload);
  return res.data;
};

// Delete campaign
export const deleteCampaign = async (id) => {
  const res = await api.delete(`/campaigns/${id}`);
  return res.data;
};
