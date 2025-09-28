require("dotenv").config();
const OpenAI = require( "openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCaptions(productName, productDescription) {
  const prompt = `Generate 3 catchy social media captions for this product:
Product: ${productName}
Description: ${productDescription || "No description"}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150
  });

  const text = response.choices[0].message.content;
  return text.split("\n").filter(line => line.trim());
}
module.exports = { generateCaptions };
