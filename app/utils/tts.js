// app/utils/tts.js
export const speak = (text, onEnd) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error("Text-to-Speech not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;

  utterance.onend = () => {
    if (onEnd) {
      onEnd();
    }
  };
  
  window.speechSynthesis.cancel(); // Cancel any previous speech
  window.speechSynthesis.speak(utterance);
};
