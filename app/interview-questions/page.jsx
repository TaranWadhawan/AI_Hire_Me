// app/interview-questions/page.jsx
'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon, LoaderCircle, Check, Sparkles, RefreshCw } from 'lucide-react';
import { questions } from '../../questions.js';
import Navbar from '../components/layout/Navbar';

const VerificationResult = ({ result }) => {
    let scoreColor = 'from-emerald-400 to-emerald-600 text-emerald-700 bg-emerald-50';
    if (result.score < 75) scoreColor = 'from-amber-400 to-amber-600 text-amber-700 bg-amber-50';
    if (result.score < 50) scoreColor = 'from-rose-400 to-rose-600 text-rose-700 bg-rose-50';

    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-5 bg-[#FAF8F5] rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
        >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">AI Evaluation Telemetry</span>
              <span className="text-base font-extrabold text-slate-800 font-mono">{result.score}% Match</span>
            </div>

            <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden shadow-inner">
                <motion.div 
                    className={`h-2.5 rounded-full bg-gradient-to-r ${scoreColor.split(' ')[0]} ${scoreColor.split(' ')[1]}`} 
                    initial={{ width: '0%' }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                />
            </div>
            
            <p className="mt-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed text-left">{result.feedback}</p>
        </motion.div>
    );
};

const categories = ["All", "Frontend", "Backend", "Machine Learning", "General"];

export default function InterviewQuestionsPage() {
    const [questionStates, setQuestionStates] = useState({});
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredQuestions = useMemo(() => {
        if (activeFilter === "All") {
            return questions;
        }
        return questions.filter(q => q.category === activeFilter);
    }, [activeFilter]);

    const handleAnswerChange = (id, value) => {
        setQuestionStates(prev => ({ ...prev, [id]: { ...prev[id], answer: value } }));
    };

    const handleVerify = async (id) => {
        const questionData = questions.find(q => q.id === id);
        const currentState = questionStates[id] || {};
        if (!currentState.answer) return;

        setQuestionStates(prev => ({ ...prev, [id]: { ...currentState, isLoading: true, result: null } }));

        try {
            const response = await fetch('/api/verify-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: questionData.question, answer: currentState.answer }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Verification failed.');

            setQuestionStates(prev => ({ ...prev, [id]: { ...prev[id], isLoading: false, result: data } }));
        } catch (error) {
            console.error(error);
            setQuestionStates(prev => ({ ...prev, [id]: { ...prev[id], isLoading: false, result: { score: 0, feedback: error.message } } }));
        }
    };

    const handleReset = (id) => {
        setQuestionStates(prev => ({ ...prev, [id]: { answer: '', isLoading: false, result: null } }));
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF8F5] font-sans selection:bg-sky-100 selection:text-sky-700">
            <Navbar />
            <main className="container mx-auto px-4 py-14 max-w-5xl">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-4 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                        Curated Repository
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Top Interview Questions</h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
                        Practice answering targeted engineering and technical interview questions with real-time AI rubric scoring.
                    </p>
                </div>

                {/* Filter Pills with Neumorphic Styling */}
                <div className="mt-10 flex items-center justify-center flex-wrap gap-2.5">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                                activeFilter === category 
                                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-[0_4px_14px_rgba(2,132,199,0.35)]' 
                                    : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 hover:border-sky-300 shadow-sm'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Questions Accordion List */}
                <div className="mt-8 max-w-3xl mx-auto space-y-4">
                    <AnimatePresence>
                        {filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q) => {
                                const state = questionStates[q.id] || {};
                                return (
                                    <motion.div
                                        key={q.id}
                                        layout
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Disclosure as="div" className="bg-white/75 backdrop-blur-xl border border-white/90 rounded-2xl shadow-[0_8px_24px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_32px_rgba(2,132,199,0.06)] transition-all overflow-hidden">
                                            {({ open }) => (
                                                <>
                                                    <DisclosureButton className="w-full flex justify-between items-center text-left px-6 py-5 cursor-pointer">
                                                        <div className="flex-1 pr-4">
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/80 px-2.5 py-0.5 rounded-full">{q.category}</span>
                                                              {q.tags.map(tag => (
                                                                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-slate-500 border border-slate-200/70 px-2.5 py-0.5 rounded-full">{tag}</span>
                                                              ))}
                                                            </div>
                                                            <p className="font-bold text-slate-800 text-sm sm:text-base">{q.question}</p>
                                                        </div>
                                                        <ChevronDownIcon className={`w-5 h-5 text-sky-500 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
                                                    </DisclosureButton>
                                                    <AnimatePresence>
                                                        {open && (
                                                            <DisclosurePanel 
                                                                static 
                                                                as={motion.div}
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden border-t border-slate-100"
                                                            >
                                                                <div className="px-6 pb-6 pt-4">
                                                                    <textarea 
                                                                        value={state.answer || ''} 
                                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                                                        placeholder="Type your structured answer here (STAR framework recommended)..." 
                                                                        rows="5" 
                                                                        className="w-full p-3.5 text-xs sm:text-sm bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all font-sans" 
                                                                        disabled={state.isLoading}
                                                                    />
                                                                    <div className="mt-4 flex items-center justify-end gap-3">
                                                                        {state.result && (
                                                                            <button 
                                                                                onClick={() => handleReset(q.id)} 
                                                                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                                                                            >
                                                                                <RefreshCw className="w-3.5 h-3.5" /> Retry
                                                                            </button>
                                                                        )}
                                                                        <button 
                                                                            onClick={() => handleVerify(q.id)} 
                                                                            disabled={state.isLoading || !state.answer} 
                                                                            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs font-semibold rounded-xl shadow-[0_6px_18px_-4px_rgba(2,132,199,0.4)] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                                                                        >
                                                                            {state.isLoading ? <LoaderCircle className="animate-spin w-4 h-4"/> : <Check className="w-4 h-4"/>}
                                                                            <span>{state.isLoading ? 'Evaluating...' : 'Verify Answer'}</span>
                                                                        </button>
                                                                    </div>
                                                                    {state.result && <VerificationResult result={state.result} />}
                                                                </div>
                                                            </DisclosurePanel>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            )}
                                        </Disclosure>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                <p className="text-sm text-slate-400">No questions found under "{activeFilter}".</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}