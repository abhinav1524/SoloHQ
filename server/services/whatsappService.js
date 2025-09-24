// services/whatsappService.js
const twilio = require("twilio");

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886' (Twilio sandbox number)

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`, // e.g., 'whatsapp:+91XXXXXXXXXX'
      body: message,
    });

    console.log(`✅ WhatsApp message sent to ${to}, SID: ${response.sid}`);
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
  }
};

module.exports = { sendWhatsAppMessage };
