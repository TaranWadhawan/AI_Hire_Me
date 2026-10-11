// app/interview/_components/InterviewScreen.jsx
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// Proctoring Imports
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// UI and Icon Imports
import { PhoneOff, LoaderCircle, Mic, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Hooks and Utilities
import { useSpeechRecognition } from '@/app/hooks/useSpeechRecognition';
import { speak } from '@/app/utils/tts';
import Modal from './Modal';

const MAX_VIOLATIONS = 5;
const DETECTION_INTERVAL_MS = 4000;

const InterviewScreen = ({ userData, onEndInterview }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chatContainerRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [interviewState, setInterviewState] = useState('speaking');
  const [proctoringModel, setProctoringModel] = useState(null);
  const [violations, setViolations] = useState(0);
  const [proctoringMessage, setProctoringMessage] = useState('');
  const [isProctoringModalOpen, setIsProctoringModalOpen] = useState(false);
  const [isReady, setIsReady] = useState({ model: false, video: false });

  const runProctoringDetection = useCallback(async () => {
    if (proctoringModel && videoRef.current && videoRef.current.readyState === 4) {
      const predictions = await proctoringModel.detect(videoRef.current);
      const personCount = predictions.filter(p => p.class === 'person').length;
      const phoneDetected = predictions.some(p => p.class === 'cell phone' && p.score > 0.6);
      
      let newViolation = false;
      let message = '';

      if (phoneDetected) {
        message = `Mobile phone detected. Electronic devices are strictly prohibited. Warning ${violations + 1}/${MAX_VIOLATIONS}.`;
        newViolation = true;
      } else if (personCount > 1) {
        message = `Multiple people detected. Please ensure you are alone. Warning ${violations + 1}/${MAX_VIOLATIONS}.`;
        newViolation = true;
      } else if (personCount === 0) {
        message = `No person detected. Please stay in the camera frame. Warning ${violations + 1}/${MAX_VIOLATIONS}.`;
        newViolation = true;
      }

      if (newViolation) {
        setProctoringMessage(message);
        setViolations(prev => prev + 1);
        setIsProctoringModalOpen(true);
      }
    }
  }, [proctoringModel, violations]);

  useEffect(() => {
    cocoSsd.load().then(model => {
      setProctoringModel(model);
      setIsReady(prev => ({ ...prev, model: true }));
      console.log("Proctoring model loaded.");
    }).catch(err => console.error("Proctoring model load error:", err));

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            setIsReady(prev => ({ ...prev, video: true }));
            console.log("Video stream is ready.");
          };
        }
      }).catch(err => console.error("Media device error:", err));

    return () => {
      console.log("Cleaning up InterviewScreen component...");
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isReady.model && isReady.video) {
      console.log("System ready. Starting proctoring detection loop.");
      detectionIntervalRef.current = setInterval(runProctoringDetection, DETECTION_INTERVAL_MS);
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isReady.model, isReady.video, runProctoringDetection]);

  useEffect(() => {
    const firstMessage = `Hello, ${userData?.fullName || 'there'}. Welcome to your interview for the ${userData?.jobTitle || 'Developer'} role. This session is proctored. Let's begin. Can you tell me a bit about yourself?`;
    setConversation([{ role: 'ai', text: firstMessage }]);
    speak(firstMessage, () => setInterviewState('idle'));
  }, [userData]);

  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [conversation]);
  
  useEffect(() => {
    if (violations >= MAX_VIOLATIONS) {
      const finalTranscript = [...conversation, { role: 'system', text: 'INTERVIEW TERMINATED DUE TO PROCTORING VIOLATIONS.' }];
      onEndInterview(finalTranscript);
    }
  }, [violations, conversation, onEndInterview]);

  useEffect(() => {
    const handleViolation = (message) => {
      setProctoringMessage(message);
      setViolations(prev => prev + 1);
      setIsProctoringModalOpen(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleViolation(`Tab switching detected. Please stay on the interview tab. Warning ${violations + 1}/${MAX_VIOLATIONS}.`);
      }
    };

    const handleBlur = () => {
      if (!isProctoringModalOpen && !isEndModalOpen) {
          handleViolation(`Window focus lost. Please do not minimize or click away. Warning ${violations + 1}/${MAX_VIOLATIONS}.`);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [violations, isProctoringModalOpen, isEndModalOpen]);

  const handleAiResponse = async (message) => {
    setInterviewState('processing');
    const newConversation = [...conversation, { role: 'user', text: message }];
    setConversation(newConversation);

    try {
      const res = await fetch('/api/interview/chat', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history: newConversation, userData }),
      });
      if (!res.ok) throw new Error("Failed to get AI response.");
      const { reply } = await res.json();
      setConversation(prev => [...prev, { role: 'ai', text: reply }]);
      setInterviewState('speaking');
      speak(reply, () => setInterviewState('idle'));
    } catch (error) {
      console.error(error);
      const errorMessage = "I'm having trouble connecting right now. Let's try that again.";
      setConversation(prev => [...prev, { role: 'ai', text: errorMessage }]);
      setInterviewState('speaking');
      speak(errorMessage, () => setInterviewState('idle'));
    }
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition({ 
    onResult: (text) => {
      setInterviewState('processing');
      handleAiResponse(text);
    },
    onError: (err) => {
      console.warn("Speech Recognition Info:", err);
      if (err.includes("didn't catch that")) {
        setInterviewState('idle');
      } else {
        setProctoringMessage(err);
        setIsProctoringModalOpen(true);
        setInterviewState('idle');
      }
    }
  });

  useEffect(() => {
    if (isListening) {
      setInterviewState('listening');
    } else if (interviewState === 'listening') {
      setInterviewState(prev => prev === 'listening' ? 'idle' : prev);
    }
  }, [isListening, interviewState]);

  const handleConfirmEndInterview = () => {
    onEndInterview(conversation); 
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full h-[90vh] flex flex-col gap-4 bg-white/70 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06),0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 overflow-hidden"
      >
        {/* Top/Main Grid: Video HUD and Chat */}
        <div className="flex-grow w-full flex flex-col md:flex-row gap-4 overflow-hidden">
          
          {/* Left Panel: Futuristic Video Stream Viewport */}
          <div className="w-full md:w-2/3 h-full bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-800 shadow-inner">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            
            {/* Top Bar Telemetry Badge */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full px-3 py-1 flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className={`w-2 h-2 rounded-full ${isReady.model && isReady.video ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isReady.model && isReady.video ? 'Proctoring Active' : 'Calibrating Sensors...'}</span>
              </div>
              
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-full px-3 py-1 text-[11px] font-mono text-sky-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AI Proctor v2.4</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Glassmorphic Chat Transcript Feed */}
          <div className="w-full md:w-1/3 h-full flex flex-col bg-[#FAF8F5]/80 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-slate-200/60 flex items-center justify-between bg-white/50">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Interview Transcript</h3>
              <span className="text-[10px] font-mono text-slate-400">Live Feed</span>
            </div>

            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {conversation.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                      {msg.role === 'user' ? 'You' : 'AI Evaluator'}
                    </span>
                    <div 
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-br-sm shadow-sm' 
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {interviewState === 'processing' && (
                <div className="flex items-center gap-2 text-xs text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full w-fit">
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing answer...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Panel: Neumorphic Control Deck */}
        <div className="flex-shrink-0 w-full flex items-center justify-between px-2 py-1 relative">
          
          {/* Violation Counter Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Violations: {violations} / {MAX_VIOLATIONS}</span>
          </div>

          {/* Central Interactive Microphone Button with Glow Rings */}
          <div className="relative flex items-center justify-center">
            {interviewState === 'listening' && (
              <span className="absolute w-20 h-20 rounded-full bg-sky-400/30 animate-ping pointer-events-none" />
            )}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => interviewState === 'listening' ? stopListening() : startListening()}
              disabled={interviewState !== 'idle' && interviewState !== 'listening'}
              aria-label={interviewState === 'listening' ? "Stop recording speech" : "Start speaking"}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-[0_8px_25px_-5px_rgba(2,132,199,0.4)] relative cursor-pointer z-10 ${
                interviewState === 'listening' 
                  ? 'bg-gradient-to-tr from-sky-400 to-sky-600 ring-4 ring-sky-300/40' 
                  : 'bg-gradient-to-tr from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500'
              } ${interviewState !== 'idle' && interviewState !== 'listening' ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <Mic className="w-6 h-6" />
            </motion.button>
          </div>

          {/* End Interview Action */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEndModalOpen(true)} 
            aria-label="End interview session"
            className="w-12 h-12 bg-rose-50 text-rose-600 border border-rose-200/80 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* End Session Confirmation Modal */}
      <Modal isOpen={isEndModalOpen} onClose={() => setIsEndModalOpen(false)} title="End Interview Session?">
        <p className="text-sm text-slate-600">Are you sure you want to conclude the interview and submit your responses for final evaluation?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setIsEndModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirmEndInterview} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-md">
            Conclude & Evaluate
          </button>
        </div>
      </Modal>

      {/* Proctoring Warning Modal */}
      <Modal isOpen={isProctoringModalOpen} onClose={() => setIsProctoringModalOpen(false)} title="Proctoring Warning">
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <p className="text-sm text-slate-800 font-semibold">{proctoringMessage}</p>
          <p className="text-xs text-slate-500 mt-2">Repeated infractions exceeding {MAX_VIOLATIONS} strikes will terminate the session automatically.</p>
          <button 
            onClick={() => setIsProctoringModalOpen(false)} 
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            I Understand
          </button>
        </div>
      </Modal>
    </>
  );
};

export default InterviewScreen;