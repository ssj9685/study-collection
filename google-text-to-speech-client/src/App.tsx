import { useState } from "react";

function App() {
  const [transcript, setTranscript] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    recorder.start();
  };

  const stopAndSend = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.ondataavailable = async (e) => {
        const audioData = e.data;
        const formData = new FormData();
        formData.append("audio", audioData);

        const response = await fetch("http://localhost:4000/stt", {
          method: "POST",
          body: formData,
        });

        const { text } = await response.json();

        setTranscript(text);
      };
    }
  };

  return (
    <div>
      <button onClick={startRecording}>마이크 시작</button>
      <button onClick={stopAndSend}>마이크 종료</button>
      <div>인식된 문장: {transcript}</div>
    </div>
  );
}

export default App;
