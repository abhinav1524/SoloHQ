const User = require("../models/Users");
const Subscription = require("../models/Subscription");

const subscribeController = async (req, res) => {
  try {
    const { planId } = req.body; // user selects plan by id
    const user = await User.findById(req.user._id);
    const plan = await Subscription.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // calculate plan end date
    const durationInDays = plan.durationInMonths * 30; // rough estimate
    user.subscription = plan.planName.toLowerCase(); // e.g. "monthly"
    user.planEndDate = new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000);
    user.subscriptionStatus = "active";

    await user.save();

    res.status(200).json({
      success: true,
      message: `Subscribed to ${plan.planName} plan successfully`,
      subscription: user.subscription,
      planEndDate: user.planEndDate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = subscribeController;
