import React, { useState } from "react";

const MarketingPlanner = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    channel: "WhatsApp",
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign({ ...newCampaign, [name]: value });
  };

  const addOrUpdateCampaign = () => {
    if (!newCampaign.title || !newCampaign.startDate) return;

    if (editingId) {
      // Update existing campaign
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingId ? { ...newCampaign, id: editingId } : c
        )
      );
      setEditingId(null);
    } else {
      // Add new campaign
      setCampaigns([...campaigns, { ...newCampaign, id: Date.now() }]);
    }

    setNewCampaign({
      title: "",
      description: "",
      channel: "WhatsApp",
      startDate: "",
      endDate: "",
    });
  };

  const handleEdit = (id) => {
    const campaign = campaigns.find((c) => c.id === id);
    setNewCampaign({
      title: campaign.title,
      description: campaign.description,
      channel: campaign.channel,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6">📅 Marketing Planner</h1>

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
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
          <ul className="space-y-4">
            {campaigns.map((c) => (
              <li
                key={c.id}
                className="p-4 border rounded flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.description}</p>
                  <p className="text-xs text-gray-500">
                    {c.startDate} → {c.endDate}
                  </p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded">
                    {c.channel}
                  </span>
                                    <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleEdit(c.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MarketingPlanner;
