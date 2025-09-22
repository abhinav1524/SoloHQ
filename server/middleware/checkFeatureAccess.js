const checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    const user = req.user; // attached via auth middleware
    const now = new Date();

    // Handle trial expiry
    if (user.subscription === "trial" && user.trialEndDate && now > user.trialEndDate) {
      user.subscription = "free";
      user.subscriptionStatus = "expired";
      await user.save();
    }

    // Handle paid plan expiry
    if (
      ["monthly", "six-month", "yearly"].includes(user.subscription) &&
      user.planEndDate &&
      now > user.planEndDate
    ) {
      user.subscription = "free";
      user.subscriptionStatus = "expired";
      await user.save();
    }

    // just set a flag
    const premiumFeatures = ["whatsapp", "ai"];

     if (user.subscription === "free" && premiumFeatures.includes(feature)) {
      req.featureRestricted = true;
      req.featureMessage = `Upgrade required to use ${feature} feature`;
    } else {
      req.featureRestricted = false;
    }
    next();
  };
};

module.exports = { checkFeatureAccess };
