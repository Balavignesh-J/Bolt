import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Invalid messages format" });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful, friendly, and knowledgeable AI assistant integrated into a social media application. Provide concise and helpful answers.",
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch response from AI" });
  }
});

export default router;
