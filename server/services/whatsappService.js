// services/whatsappService.js
import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; 
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

export const sendWhatsAppMessage = async (to, message) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ WhatsApp message sent to ${to}`);
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.response?.data || error.message);
  }
};
