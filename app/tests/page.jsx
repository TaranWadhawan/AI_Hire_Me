// app/tests/page.jsx
'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, LoaderCircle, Lightbulb, Trophy, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function QuizzesPage() {
    const [quizState, setQuizState] = useState('topic');
    const [topic, setTopic] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        if (!topic) return;
        setQuizState('loading');
        setError('');
        try {
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setQuizData(data.questions);
            setUserAnswers(new Array(data.questions.length).fill(null));
            setQuizState('taking');
        } catch (err) {
            setError(err.message);
            setQuizState('topic');
        }
    };
    
    const handleAnswerSelect = (questionIndex, optionIndex) => {
        const newAnswers = [...userAnswers];
        newAnswers[questionIndex] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const handleSubmitQuiz = () => {
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizData[index].correctAnswer) {
                score++;
            }
        });
        setResults({ score, total: quizData.length });
        setQuizState('results');
    };

    const handleReset = () => {
        setQuizState('topic');
        setTopic('');
        setQuizData(null);
        setUserAnswers([]);
        setResults(null);
        setError('');
    };

    const renderContent = () => {
        switch (quizState) {
            case 'loading':
                return (
                    <div className="text-center p-12 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06)] max-w-md mx-auto">
                        <LoaderCircle className="w-12 h-12 mx-auto animate-spin text-sky-500" />
                        <h2 className="mt-5 text-xl font-bold text-slate-800">Generating Assessment...</h2>
                        <p className="mt-1.5 text-xs text-slate-500">Compiling 5 calibrated multiple-choice questions for "{topic}".</p>
                    </div>
                );
            
            case 'taking':
                return (
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <span className="text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-full">Active Quiz</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">{topic}</h2>
                        </div>

                        <div className="space-y-6">
                            {quizData.map((q, qIndex) => (
                                <div key={qIndex} className="bg-white/80 backdrop-blur-2xl border border-white/90 p-7 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                                    <p className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                                        <span className="text-sky-600 mr-2 font-mono">{qIndex + 1}.</span> {q.questionText}
                                    </p>
                                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {q.options.map((option, oIndex) => {
                                            const isSelected = userAnswers[qIndex] === oIndex;
                                            return (
                                                <button
                                                    key={oIndex}
                                                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                                    className={`p-3.5 text-left text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                                                        isSelected 
                                                            ? 'border-sky-400 bg-sky-50/80 text-sky-900 shadow-sm ring-2 ring-sky-400/15' 
                                                            : 'border-slate-200/80 bg-[#FAF8F5]/60 hover:bg-white hover:border-sky-300 text-slate-700'
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={userAnswers.includes(null)}
                                className="px-9 py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] disabled:opacity-50 transition-all cursor-pointer"
                            >
                                Submit Answers & Evaluate
                            </button>
                        </div>
                    </div>
                );

            case 'results':
                return (
                    <div className="text-center w-full max-w-3xl mx-auto">
                        <div className="w-16 h-16 bg-sky-50 text-sky-600 border border-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quiz Complete!</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Your final score: <span className="font-extrabold text-sky-600 font-mono text-base">{results.score} / {results.total}</span>
                        </p>

                        <div className="mt-8 text-left space-y-4">
                            {quizData.map((q, qIndex) => {
                                const userAnswer = userAnswers[qIndex];
                                const isCorrect = userAnswer === q.correctAnswer;
                                return (
                                    <div key={qIndex} className={`p-5 rounded-2xl border bg-white/80 backdrop-blur-xl ${isCorrect ? 'border-emerald-200 shadow-[0_4px_16px_rgba(16,185,129,0.05)]' : 'border-rose-200 shadow-[0_4px_16px_rgba(244,63,94,0.05)]'}`}>
                                        <p className="font-bold text-slate-800 text-xs sm:text-sm">{qIndex + 1}. {q.questionText}</p>
                                        <p className={`mt-2 text-xs font-semibold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            Your answer: {q.options[userAnswer]} {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                        </p>
                                        {!isCorrect && (
                                            <p className="mt-1 text-xs text-emerald-800 font-semibold">Correct answer: {q.options[q.correctAnswer]}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button 
                            onClick={handleReset} 
                            className="mt-10 px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_8px_20px_-4px_rgba(2,132,199,0.35)] transition-all flex items-center gap-2 mx-auto cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" /> Take Another Quiz
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="text-center p-10 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06)] max-w-lg mx-auto">
                        <div className="w-14 h-14 bg-sky-50 text-sky-600 border border-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Lightbulb className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Generate Technical Quiz</h1>
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">Enter any framework or language topic to produce a multiple-choice challenge.</p>
                        
                        <form onSubmit={handleGenerateQuiz} className="mt-6 space-y-3">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. React Hooks, Go Concurrency, Docker..."
                                className="w-full px-4 py-3 bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all font-sans"
                            />
                            <button 
                                type="submit" 
                                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_8px_20px_-4px_rgba(2,132,199,0.35)] transition-all cursor-pointer"
                            >
                                Generate Challenge
                            </button>
                        </form>
                        {error && <p className="mt-3 text-xs font-semibold text-rose-500">{error}</p>}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF8F5] font-sans selection:bg-sky-100 selection:text-sky-700">
            <Navbar />
            <main className="container mx-auto px-4 py-14">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={quizState}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-4xl"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}