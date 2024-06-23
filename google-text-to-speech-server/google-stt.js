//@ts-check
import speech from "@google-cloud/speech";
import credentials from "./credential.json" with { type: "json" };
import express from 'express';
import cors from 'cors';
import multer from "multer";

const client = new speech.SpeechClient({
  credentials,
});

async function startSTT(content) {
  const [response] = await client.recognize({
    audio: { content: content.buffer },
    config: {
      encoding: 'WEBM_OPUS',
      languageCode: 'ko-KR',
    },
  });

  const transcription = response.results?.map((result) => result.alternatives?.[0].transcript)
    .join("\n");

  return transcription;
}

const app = express()
app.use(express.json());
app.use(cors())

const port = 4000;

app.post("/stt", multer().single("audio"), async (req, res) => {
  const text = await startSTT(req.file);

  res.json({ text });
});

app.listen(port);
