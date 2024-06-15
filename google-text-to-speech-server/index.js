import speech from "@google-cloud/speech";
import credentials from "./credential.json" with { type: "json" };
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const client = new speech.SpeechClient({
  credentials,
});

async function startSTT(content) {
  const config = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  const [response] = await client.recognize({
    audio: { content },
    config: config,
  });

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  console.log(`Transcription: ${transcription}`);
}

function handleFormData(req, res){
  let body = [];

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const buffer = Buffer.concat(body);
      const filename = 'uploaded_file.txt';
      const filePath = path.join(__dirname, 'uploads', filename);

      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Error uploading file');
        } else {
          console.log(`File ${filename} uploaded successfully!`);
          res.statusCode = 200;
          res.end('File uploaded successfully');
        }
      });
    });
}

const app = express()
app.use(express.json());
app.use(cors())

const port = 4000;

app.post('/stt', (req, res) => {
  const data = handleFormData(req, res);
  startSTT(data);
})

app.listen(port);
