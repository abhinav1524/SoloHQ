import React, { useState, useEffect } from "react";
import {
  getCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} from "../services/marketingService"; // adjust path if needed
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";

const MarketingPlanner = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    channel: "WhatsApp",
    startDate: "",
    endDate: "",
    reminderTime: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch campaigns when component mounts
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast.error("Failed to fetch campaigns ❌");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign({ ...newCampaign, [name]: value });
  };

  // ✅ Add or update campaign
  const addOrUpdateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.startDate) {
      toast.error("Title and start date are required");
      return;
    }

    try {
      if (editingId) {
        // Update campaign
        const updated = await updateCampaign(editingId, newCampaign);
        setCampaigns(
          campaigns.map((c) => (c._id === editingId ? updated : c))
        );
        setEditingId(null);
        toast.success("Campaign updated ✅");
      } else {
        // Add campaign
        const created = await addCampaign(newCampaign);
        setCampaigns([created, ...campaigns]);
        toast.success("Campaign created 🎉");
      }

      // Reset form
      setNewCampaign({
        title: "",
        description: "",
        channel: "WhatsApp",
        startDate: "",
        endDate: "",
        reminderTime: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save campaign ❌");
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const campaign = campaigns.find((c) => c._id === id);
    if (!campaign) return;

    setNewCampaign({
      title: campaign.title,
      description: campaign.description,
      channel: campaign.channel,
      startDate: campaign.startDate?.split("T")[0] || "",
      endDate: campaign.endDate?.split("T")[0] || "",
       reminderTime: campaign.reminderTime
    ? campaign.reminderTime.slice(0, 16)
    : "",     
    });
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCampaign(id);
      setCampaigns(campaigns.filter((c) => c._id !== id));
      toast.success("Campaign deleted 🗑️");
      if (editingId === id) setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete ❌");
      console.error(error);
    }
  };

  return (
    <div className="w-full mx-auto p-4 bg-gray-50">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6">
        📅 Marketing Planner
      </h1>

      {/* Campaign Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Campaign" : "Create Campaign"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={newCampaign.title}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <select
            name="channel"
            value={newCampaign.channel}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option>WhatsApp</option>
            <option>Email</option>
            <option>Instagram</option>
            <option>Facebook</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={newCampaign.startDate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="endDate"
            value={newCampaign.endDate}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="time"
            name="reminderTime"
            value={newCampaign.reminderTime}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <textarea
            name="description"
            placeholder="Campaign Details / Notes"
            value={newCampaign.description}
            onChange={handleChange}
            className="p-2 border rounded md:col-span-2"
          />
        </div>
        <button
          onClick={addOrUpdateCampaign}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {editingId ? "Update Campaign" : "Add Campaign"}
        </button>
      </div>

      {/* Campaign List */}
     <div className="bg-white shadow-md rounded-lg p-4">
  <h2 className="text-lg font-semibold mb-3">📌 Planned Campaigns</h2>
  {campaigns.length === 0 ? (
    <p className="text-gray-500">No campaigns planned yet.</p>
  ) : (
    <div className="max-h-80 overflow-y-auto pr-2">
      <ul className="space-y-4">
        {campaigns.map((c) => (
          <li
            key={c._id}
            className="p-4 border rounded flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.description}</p>
              <p className="text-xs text-gray-500">
                {c.startDate?.split("T")[0]} → {c.endDate?.split("T")[0]}
              </p>
               <p className="text-xs text-gray-500">
                time is {c.reminderTime}
              </p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                {c.channel}
              </span>
              <button
                className="bg-yellow-400 text-white px-2 py-2 rounded text-sm"
                onClick={() => handleEdit(c._id)}
              >
                <Edit size={18} />
              </button>
              <button
                className="bg-red-500 text-white px-2 py-2 rounded text-sm"
                onClick={() => handleDelete(c._id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
    </div>
  );
};

export default MarketingPlanner;
