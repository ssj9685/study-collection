//@ts-check
import express from "express";
import cors from "cors";
import multer from "multer";

const apiKey = process.env.API_KEY;

async function startSTT(content) {
  try {
    const audioBlob = new Blob([content.buffer], { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    formData.append("model", "whisper-1");
    formData.append("language", "ko");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    const transcription = await response.json();

    return transcription.text;
  } catch (e) {
    console.error(e);
  }
}

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000;

app.post("/stt", multer().single("audio"), async (req, res) => {
  const text = await startSTT(req.file);

  res.json({ text });
});

app.listen(port);
