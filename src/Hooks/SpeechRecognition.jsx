import { useState } from "react";

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition(); // Use speech recognition API
    recognition.continuous = false; // Stop after one sentence
    recognition.interimResults = false; // Get final results only
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript; // Extract text
      setTranscript(text);
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start(); // Start speech recognition
  };

  return { transcript, isListening, startListening };
};

export default useSpeechRecognition;