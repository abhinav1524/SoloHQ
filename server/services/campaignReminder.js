// jobs/campaignReminderJob.js
const cron = require("node-cron");
const Campaign = require("../models/Campaign");
const { sendWhatsAppMessage } = require("../services/whatsappService");
const moment = require("moment-timezone");

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log("⏰ Running Campaign Reminder Job at", new Date().toISOString());

    const now = new Date();

    // Fetch all campaigns with reminderTime
    const campaigns = await Campaign.find({
      reminderTime: { $exists: true },
    }).populate("user", "phone name email timezone");

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
      console.log("   Now (User TZ):", nowUserTz.format("YYYY-MM-DD HH:mm:ss"));
      console.log("   Reminder (User TZ):", reminderMoment.format("YYYY-MM-DD HH:mm:ss"));
      console.log("   Diff (ms):", diff);
      console.log("   Reminder sent already:", campaign.reminderSent);

      // Only send reminder if not sent and within 5 min window
      if (!campaign.reminderSent && diff >= 0 && diff <= 5 * 60 * 1000) {
        const message = `📢 Reminder: Your campaign "${campaign.title}" starts today on ${campaign.channel}! 
Don't forget to create your post to advertise 🚀.`;

        try {
          const response = await sendWhatsAppMessage(user.phone, message);
          console.log(
            `✅ Reminder sent to ${user.phone}, SID: ${response?.sid || "N/A"}, Status: ${response?.status || "N/A"}`
          );

          // Mark as sent
          campaign.reminderSent = true;
          await campaign.save();
        } catch (sendErr) {
          console.error("❌ Failed to send WhatsApp message:", sendErr.message);
        }
      } else if (campaign.reminderSent) {
        console.log("⏭️ Skipping → reminder already sent");
      } else {
        console.log("⏭️ Not sending reminder → diff not in range");
      }
    }

    console.log("✅ Campaign reminders checked successfully.\n");
  } catch (error) {
    console.error("❌ Error in Campaign Reminder Job:", error.message);
  }
});
