require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        input: `You are a booking assistant for a barber shop.
Opening hours: 9am–6pm.
Haircut: £18.
Skin fade: £22.
Location: London.
Be polite and encourage booking by asking for name and phone number.

Customer: ${userMessage}`
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text || "Sorry, something went wrong.";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "Server error." });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
