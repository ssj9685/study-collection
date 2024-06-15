import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const useWebsocket = (props: { handler: (event: MessageEvent) => void }) => {
  const { handler } = props;

  const ws = useMemo(() => new WebSocket("wss://localhost:8080"), []);

  const onOpen = useCallback(() => {
    const search = new URLSearchParams(window.location.search);
    ws.send(JSON.stringify({ id: search.get("id") }));
  }, [ws]);

  useEffect(() => {
    ws.addEventListener("open", onOpen);
    ws.addEventListener("message", handler);

    return () => {
      ws.removeEventListener("open", onOpen);
      ws.removeEventListener("message", handler);
    };
  }, [handler, onOpen, ws]);

  return { ws };
};

class SRC {
  static _instance: SpeechRecognition;

  static getInstance() {
    if (!SRC._instance) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      SRC._instance = new SpeechRecognition();
    }

    return SRC._instance;
  }
}

function App() {
  const [text, setText] = useState("");
  const recognition = SRC.getInstance();

  const handleWebsocketMessage = useCallback(async (event: MessageEvent) => {
    if (typeof event.data === "string") {
      setText(event.data);
    }
    if (event.data instanceof Blob) {
      const translatedText = await event.data.text();
      console.log(translatedText);
      setText(translatedText);
    }
  }, []);

  const { ws } = useWebsocket({ handler: handleWebsocketMessage });

  recognition.lang = "ko-KR";
  recognition.continuous = true;

  useEffect(() => {
    recognition.onstart = console.log;
    recognition.onend = console.warn;
    recognition.onerror = console.error;
    recognition.onresult = (event) => {
      const { results } = event;
      const lastResult = results[results.length - 1];
      const lastTranscript = lastResult[lastResult.length - 1].transcript;

      ws.send(JSON.stringify({ lastTranscript }));
    };

    recognition.start();
  }, [recognition, ws]);

  return <div>{text}</div>;
}

export default App;
