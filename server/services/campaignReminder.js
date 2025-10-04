// jobs/campaignReminder.js
const cron = require("node-cron");
const Campaign = require("../models/Campaign");
const { sendWhatsAppMessage } = require("../services/whatsappService");
const moment = require("moment-timezone");

// Helper: check if user can use WhatsApp alerts
const canUseWhatsApp = (user) => {
  if (!user) return false;

  const now = new Date();

  // Trial users: check trialEndDate
  if (user.trialEndDate && user.trialEndDate > now) {
    return true;
  }

  // Paid users: check subscription status
  if (user.subscription && user.subscription.status === "active") {
    return true;
  }

  return false;
};


// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log("⏰ Running Campaign Reminder Job at", new Date().toISOString());

    const now = new Date();

    // Fetch all campaigns with a reminderTime
    const campaigns = await Campaign.find({ reminderTime: { $exists: true } })
      .populate("user", "phone name email timezone subscription trialEndDate");

    for (const campaign of campaigns) {
      const user = campaign.user;
      if (!user?.phone) {
        console.log(`⚠️ Skipping campaign "${campaign.title}" → user has no phone`);
        continue;
      }

      const userTimezone = user.timezone || "UTC";

      // Combine startDate + reminderTime in user's timezone
      const reminderMoment = moment.tz(
        `${campaign.startDate.toISOString().split("T")[0]} ${campaign.reminderTime}`,
        "YYYY-MM-DD HH:mm",
        userTimezone
      );

      const nowUserTz = moment.tz(now, userTimezone);
      const diff = nowUserTz.diff(reminderMoment);

      // Debug logs
      console.log("📌 Campaign:", campaign.title);
      console.log("   User:", user.name, "| Phone:", user.phone, "| TZ:", userTimezone);
      console.log("   Subscription:", user.subscription, "| TrialEnd:", user.trialEndDate,);
      console.log("   status:", user.subscription.status);
      console.log("   Now (User TZ):", nowUserTz.format("YYYY-MM-DD HH:mm:ss"));
      console.log("   Reminder (User TZ):", reminderMoment.format("YYYY-MM-DD HH:mm:ss"));
      console.log("   Diff (ms):", diff);

      // Check if reminder is due (1 min tolerance)
      if (diff >= 0 && diff <= 60000) {
        if (canUseWhatsApp(user)) {
          const message = `📢 Reminder: Your campaign "${campaign.title}" starts today on ${campaign.channel}!
          Don't forget to create your post to advertise 🚀.`;
          try {
            await sendWhatsAppMessage(`+91${user.phone}`, message);
            console.log("✅ Reminder sent to", user.phone);
          } catch (sendErr) {
            console.error("❌ Failed to send WhatsApp message:", sendErr.message);
          }
        } else {
          console.log(`⚠️ WhatsApp alert blocked → user "${user.name}" is not trial or paid subscriber`);
        }
      } else {
        console.log("⏭️ Not sending reminder (diff not in range)");
      }
    }

    // console.log("✅ Campaign reminders checked successfully.\n");
  } catch (error) {
    console.error("❌ Error in Campaign Reminder Job:", error.message);
  }
});
