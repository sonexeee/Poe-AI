const express = require("express");
const { pipeline } = require("@xenova/transformers");

const app = express();
app.use(express.json());
const port = 3000;

let generator;

// Load the AI model at startup
async function loadModel() {
  console.log("Loading AI model...");
  generator = await pipeline("text-generation", "Xenova/gpt-neo-1.3B");
  console.log("Model loaded successfully!");
}

app.post("/chat", async (req, res) => {
  const userInput = req.body.message;

  if (!userInput) {
    return res.status(400).json({ error: "No input provided!" });
  }

  try {
    const response = await generator(userInput, {
      max_length: 100,
      do_sample: true,
      temperature: 0.7,
    });
    res.json({ response: response[0].generated_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating response." });
  }
});

app.listen(port, async () => {
  await loadModel();
  console.log(`AI server running at http://localhost:${port}`);
});
