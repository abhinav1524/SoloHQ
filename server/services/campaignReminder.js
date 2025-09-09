// jobs/campaignReminderJob.js
const cron = require("node-cron");
const Campaign = require("../models/Campaign");
const { sendWhatsAppMessage } = require("./whatsappService");
const User = require("../models/Users");

// Run daily at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("⏰ Running Campaign Reminder Job...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Find campaigns starting today
    const campaigns = await Campaign.find({
      startDate: { $gte: today, $lt: tomorrow },
    }).populate("user", "phone name email");

    for (const campaign of campaigns) {
      if (campaign.user?.phone) {
        const message = `📢 Reminder: Your campaign "${campaign.title}" starts today on ${campaign.channel}!  
Don’t forget to create your post to advertise 🚀.`;
        await sendWhatsAppMessage(campaign.user.phone, message);
      }
    }

    console.log("✅ Campaign reminders sent successfully.");
  } catch (error) {
    console.error("❌ Error sending campaign reminders:", error.message);
  }
});
