import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const router = express.Router();

// Initialize OpenAI client as per official documentation
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /ai/insights - Generate AI insights for a client
router.post("/insights", async (req, res) => {
  try {
    const { clientData } = req.body;
    
    if (!clientData) {
      return res.status(400).json({ error: "Client data is required" });
    }

    const prompt = `Provide sales insights and recommendations for this client based on the client they are working with and the notes they have provided about them.

Client Information:
- Name: ${clientData.client || clientData.name || 'Not provided'}
- Email: ${clientData.email || 'Not provided'}
- Phone: ${clientData.phone || 'Not provided'}
- Notes: ${clientData.notes || 'No notes available'}

Instructions:
For this info you have been given (client name/notes), only provide actionable advice for this client relationship if there is a sufficient amount of info in the notes section or they are a well-known client. 

A well-known client is any client you classify as being a well-known client because they are a large or reputable company. Along with that I will allow you to classify what is a sufficient amount of notes for you to provide insights. 

If you feel like you don't have enough info, tell the user in your response that you need more info or you can ask follow up questions if there is a decent amount of info, but not enough to provide insights.`;

    // Use OpenAI SDK as per official documentation - following their basic API request pattern
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful sales assistant providing insights about clients."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500
    });

    res.json({ 
      insights: response.choices[0].message.content 
    });
  } catch (error) {
    console.error("Error generating AI insights:", error);
    res.status(500).json({ error: "Error generating insights. Please try again." });
  }
});

export default router;
