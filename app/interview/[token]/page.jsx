'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ResumeUpload from '../practice/_components/ResumeUpload'; 
import LobbyScreen from '../practice/_components/LobbyScreen';
import InterviewScreen from '../practice/_components/InterviewScreen';
import Modal from '../practice/_components/Modal';
import { PhoneOff, LoaderCircle, CheckCircle2, Sparkles } from 'lucide-react';

export default function ScheduledInterviewPage() {
  const params = useParams();
  const token = params?.token;

  const [step, setStep] = useState('loading'); 
  const [scheduledData, setScheduledData] = useState(null); 
  const [analyzedData, setAnalyzedData] = useState(null); 
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setStep('error');
      setError('No interview token was found in the URL.');
      return;
    }

    const fetchInterviewDetails = async () => {
      try {
        console.log(">>> CLIENT: Fetching details for token:", token);
        const response = await fetch(`/api/interview-details/${token}`);
        
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error("The server returned an invalid response format.");
        }

        if (!response.ok) throw new Error(data.error || 'Failed to load interview details.');
        if (data.status === 'completed') throw new Error('This interview has already been completed.');

        setScheduledData(data);
        setStep('upload'); 
      } catch (err) {
        setError(err.message);
        setStep('error');
      }
    };

    fetchInterviewDetails();
  }, [token]);

  const handleResumeSubmit = async (formData) => {
    try {
      const response = await fetch('/api/interview/start-from-resume', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to process resume.');
      }
      const data = await response.json();

      setAnalyzedData(data.user);
      setStep('lobby');
    } catch (err) {
      handleError(err.message);
    }
  };
  
  const handleError = (message) => {
    setError(message);
    setIsErrorModalOpen(true);
  };

  const handleStartFromLobby = () => setStep('interview');
  
  const handleEndAndSubmit = async (transcript) => {
    setStep('submitting');
    try {
      const response = await fetch('/api/analyze-and-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, transcript }),
      });
      
      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to submit interview.");
      }
      
      const data = await response.json();
      setAnalyzedData(prev => ({ ...prev, report: data.report }));
      setStep('completed');
    } catch (err) {
      setError(err.message);
      setStep('error');
    }
  };

  const renderStep = () => {
    const finalUserData = { ...scheduledData, ...analyzedData };

    switch (step) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="w-8 h-8 text-sky-500 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Verifying your secure interview session...</p>
          </div>
        );
      
      case 'upload':
        return <ResumeUpload onBack={null} onUploadSubmit={handleResumeSubmit} />;
      
      case 'lobby':
        return <LobbyScreen userData={finalUserData} onStart={handleStartFromLobby} onHaveIssues={handleError} />;
      
      case 'interview':
        return <InterviewScreen userData={finalUserData} onEndInterview={handleEndAndSubmit} />;
      
      case 'submitting':
        return (
          <div className="p-10 max-w-md bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.08)] flex flex-col items-center text-center gap-4">
            <div className="relative p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <LoaderCircle className="w-10 h-10 text-sky-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Synthesizing Evaluation</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our neural models are compiling your behavioral, communication, and technical metrics. Please keep this browser window open.
            </p>
          </div>
        );
      
      case 'completed':
        return (
          <div className="w-full max-w-4xl bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.06)] overflow-hidden text-left flex flex-col h-[85vh]">
            <div className="bg-gradient-to-r from-[#FAF8F5] to-sky-50/50 border-b border-sky-100 p-7 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Concluded
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Evaluation Report Generated</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Your official performance telemetry has been recorded.</p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-grow prose prose-slate max-w-none text-slate-700">
              <div dangerouslySetInnerHTML={{ __html: analyzedData?.report }} />
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-400 italic">This evaluation summary has also been transmitted to your email address and the hiring team.</p>
              </div>
            </div>

            <div className="p-5 bg-[#FAF8F5]/80 border-t border-slate-200/60 flex justify-center flex-shrink-0">
              <button 
                onClick={() => window.location.href = '/'} 
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-sm font-semibold rounded-2xl shadow-[0_8px_20px_-4px_rgba(2,132,199,0.4)] transition-all cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="p-10 max-w-md bg-white/80 backdrop-blur-2xl border border-rose-100 rounded-3xl shadow-xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl flex items-center justify-center">
              <PhoneOff className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Session Error</h1>
            <p className="text-sm text-slate-500">{error}</p>
            <button 
              onClick={() => setStep('interview')} 
              className="mt-2 px-6 py-2.5 bg-[#FAF8F5] border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-white transition-all"
            >
              Retry Connection
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 selection:bg-sky-100 selection:text-sky-700">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-7xl flex items-center justify-center text-center"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} title="Notice">
        <p className="text-sm text-slate-600 leading-relaxed">{error}</p>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setIsErrorModalOpen(false)} 
            className="px-5 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-semibold rounded-xl shadow-md"
          >
            Acknowledge
          </button>
        </div>
      </Modal>
    </div>
  );
}