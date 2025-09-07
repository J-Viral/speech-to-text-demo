// backend/index.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const api_key = process.env.DEEPGRAM_API_KEY; // 🔑 Replace with your Deepgram API Key

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Speech-to-Text endpoint
app.post("/speech-to-text", async (req, res) => {
  try {
    // You can send audio url in body or use a default one
    const { audioUrl } = req.body;

    if (!api_key) {
        console.log(api_key)
      return res.status(500).json({ error: "Deepgram API key is not set" });
    }

    if (!audioUrl) {
      console.warn("No audio URL provided, using default audio.");
    }

    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: audioUrl || "https://dpgr.am/spacewalk.wav",
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
