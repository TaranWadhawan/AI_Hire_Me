// app/interview/practice/page.jsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Selection from './_components/Selection';
import ResumeUpload from './_components/ResumeUpload';
import DetailsForm from './_components/DetailsForm';
import LobbyScreen from './_components/LobbyScreen';
import InterviewScreen from './_components/InterviewScreen';
import Modal from './_components/Modal';
import { LoaderCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PracticeInterviewPage() {
  const [step, setStep] = useState('selection');
  const [userData, setUserData] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // --- Navigation Handlers for Practice Flow ---
  const handleSelectUpload = () => setStep('upload');
  const handleSelectForm = () => setStep('form');
  const handleBackToSelection = () => setStep('selection');
  const handleStartFromLobby = () => setStep('interview');

  const handleEndPracticeInterview = async (transcript) => {
    setStep('submitting');
    try {
      const response = await fetch('/api/analyze-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            jobTitle: userData?.jobTitle || 'Developer', 
            transcript 
        }),
      });
      
      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to analyze practice session.");
      }
      
      const data = await response.json();
      setReport(data.report);
      setStep('completed');
    } catch (err) {
      handleError(err.message);
      setStep('interview');
    }
  };

  const handleError = (message = "Something went wrong.") => {
    setError(message);
    setIsErrorModalOpen(true);
  };

  // --- Data Handlers for Practice Flow ---
  const handleFormSubmit = async (formData) => {
    setUserData({ ...formData, difficulty: 'Practice' });
    setStep('lobby');
  };

  const handleUploadSubmit = async (formData) => {
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
      setUserData({ ...data.user, interviewType: 'Practice Session' });
      setStep('lobby');
    } catch (err) {
      handleError(err.message);
    }
  };

  // --- Step Renderer for Practice Flow ---
  const renderStep = () => {
    switch (step) {
      case 'selection':
        return <motion.div key="selection" className="w-full"><Selection onSelectUpload={handleSelectUpload} onSelectForm={handleSelectForm} /></motion.div>;
      case 'upload':
        return <motion.div key="upload" className="w-full"><ResumeUpload onBack={handleBackToSelection} onUploadSubmit={handleUploadSubmit} /></motion.div>;
      case 'form':
        return <motion.div key="form" className="w-full"><DetailsForm onBack={handleBackToSelection} onFormSubmit={handleFormSubmit} /></motion.div>;
      case 'lobby':
        return <motion.div key="lobby" className="w-full"><LobbyScreen userData={userData} onStart={handleStartFromLobby} onHaveIssues={handleError} /></motion.div>;
      case 'interview':
        return (
          <motion.div key="interview" className="w-full h-[85vh] max-w-7xl">
            <InterviewScreen userData={userData} onEndInterview={handleEndPracticeInterview} />
          </motion.div>
        );
      case 'submitting':
        return (
          <div className="p-10 max-w-md bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.08)] flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
              <LoaderCircle className="w-10 h-10 text-sky-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Synthesizing Feedback</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our AI analyst is reviewing your responses, cadence, and technical depth. Your practice report will appear shortly.
            </p>
          </div>
        );
      case 'completed':
        return (
          <div className="w-full max-w-4xl bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_25px_60px_rgba(15,23,42,0.06)] overflow-hidden text-left flex flex-col h-[82vh]">
            <div className="bg-gradient-to-r from-[#FAF8F5] to-sky-50/60 border-b border-sky-100 p-7 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Practice Concluded
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Performance Summary</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Review your competency scores and recommendations below.</p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-grow prose prose-slate max-w-none text-slate-700">
              <div dangerouslySetInnerHTML={{ __html: report }} />
            </div>

            <div className="p-5 bg-[#FAF8F5]/80 border-t border-slate-200/60 flex justify-center flex-shrink-0">
              <button 
                onClick={() => setStep('selection')} 
                className="px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-sm font-semibold rounded-2xl shadow-[0_8px_20px_-4px_rgba(2,132,199,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-slate-500">Loading session...</p>;
    }
  };

  return (
    <>
      <div className="container w-full mx-auto flex items-center justify-center p-4">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
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
    </>
  );
}