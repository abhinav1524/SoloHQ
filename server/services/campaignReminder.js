const cron = require("node-cron");
const Campaign = require("../models/Campaign");
const { sendWhatsAppMessage } = require("./whatsappService");
const moment = require("moment-timezone");

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log("⏰ Running Campaign Reminder Job at", new Date());

    const now = new Date();

    // Fetch all campaigns with a reminderTime
    const campaigns = await Campaign.find({
      reminderTime: { $exists: true },
    }).populate("user", "phone name email timezone");

    for (const campaign of campaigns) {
      const user = campaign.user;
      if (!user?.phone) continue;

      const userTimezone = user.timezone || "UTC";

      // Combine startDate + reminderTime in user's timezone
      const reminderMoment = moment.tz(
        `${campaign.startDate.toISOString().split("T")[0]} ${campaign.reminderTime}`,
        "YYYY-MM-DD HH:mm",
        userTimezone
      );

      // Only send reminder if it's due (within 1 minute)
      const diff = moment.tz(now, userTimezone).diff(reminderMoment);
      if (diff >= 0 && diff < 60000) {
        const message = `📢 Reminder: Your campaign "${campaign.title}" starts today on ${campaign.channel}! 
Don't forget to create your post to advertise 🚀.`;

        await sendWhatsAppMessage(user.phone, message);
        console.log("✅ Reminder sent to", user.phone);
      }
    }

    console.log("✅ Campaign reminders checked successfully.");
  } catch (error) {
    console.error("❌ Error in Campaign Reminder Job:", error.message);
  }
});
