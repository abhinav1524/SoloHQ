const Subscription = require("../models/Subscription.js");

// Create a subscription plan (admin only)
 const createSubscription = async (req, res) => {
  try {
    const { planName, price, durationInMonths, features } = req.body;

    const newPlan = new Subscription({
      planName,
      price,
      durationInMonths,
      features,
    });

    await newPlan.save();
    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all subscription plans (public)
 const getSubscriptions = async (req, res) => {
  try {
    const plans = await Subscription.find();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single subscription plan
 const getSubscriptionById = async (req, res) => {
  try {
    const plan = await Subscription.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update subscription plan (admin)
 const updateSubscription = async (req, res) => {
  try {
    const updatedPlan = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPlan) return res.status(404).json({ success: false, message: "Plan not found" });

    res.status(200).json({ success: true, data: updatedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete subscription plan (admin)
 const deleteSubscription = async (req, res) => {
  try {
    const deletedPlan = await Subscription.findByIdAndDelete(req.params.id);

    if (!deletedPlan) return res.status(404).json({ success: false, message: "Plan not found" });

    res.status(200).json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports={createSubscription,getSubscriptions,getSubscriptionById,updateSubscription,deleteSubscription}
