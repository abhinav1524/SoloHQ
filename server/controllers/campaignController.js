const Campaign = require("../models/Campaign");

const getCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({ user: req.user._id });
  res.json(campaigns);
};

const addCampaign = async (req, res) => {
  const { title, description, channel, startDate, endDate } = req.body;
  const campaign = await Campaign.create({
    user: req.user._id,
    title,
    description,
    channel,
    startDate,
    endDate,
  });
  res.status(201).json(campaign);
};

const updateCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  if (campaign.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  Object.assign(campaign, req.body);
  await campaign.save();
  res.json(campaign);
};

const deleteCampaign = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: "Campaign not found" });
  if (campaign.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  await campaign.remove();
  res.json({ message: "Campaign removed" });
};

module.exports = { getCampaigns, addCampaign, updateCampaign, deleteCampaign };
