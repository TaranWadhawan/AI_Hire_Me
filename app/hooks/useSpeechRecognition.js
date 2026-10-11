// app/hooks/useSpeechRecognition.js
'use client';
import { useState, useEffect, useRef } from 'react';

// MODIFIED: Added onError callback to the props
export const useSpeechRecognition = ({ onResult, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  // Keep refs updated with the latest callbacks
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      if (onErrorRef.current) onErrorRef.current("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript && onResultRef.current) onResultRef.current(finalTranscript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        if (onErrorRef.current) onErrorRef.current("I didn't catch that. Please try speaking again.");
      } else if (event.error === 'aborted') {
        console.log('Speech recognition stopped manually.');
      } else {
        console.error('Speech recognition error:', event.error);
        if (onErrorRef.current) onErrorRef.current(`An error occurred: ${event.error}`);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []); // Empty dependency array ensures it only runs once on mount

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition:", e);
        if (onErrorRef.current) onErrorRef.current("Could not start the microphone.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening };
};
