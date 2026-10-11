// app/resume-screening/page.jsx
'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, LoaderCircle, CheckCircle2, XCircle, FileScan, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const ScoreGauge = ({ score }) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    let strokeColor = '#0284C7';
    if (score >= 75) strokeColor = '#10B981';
    else if (score < 50) strokeColor = '#F43F5E';

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 140 140">
                <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="70" cy="70" />
                <motion.circle
                    className="transition-colors duration-1000"
                    stroke={strokeColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="70"
                    cy="70"
                    transform="rotate(-90 70 70)"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-4xl font-extrabold text-slate-800 font-mono tracking-tight"
              >
                {score}
              </motion.span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Match %</span>
            </div>
        </div>
    );
};

export default function ResumeScreeningPage() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [screeningResult, setScreeningResult] = useState(null);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 2 * 1024 * 1024,
        multiple: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobDescription) {
            setError('Please provide both a resume file and a job description.');
            return;
        }
        setIsLoading(true);
        setError('');
        setScreeningResult(null);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            const response = await fetch('/api/screen-resume', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'An unknown error occurred.');
            setScreeningResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
      setFile(null);
      setJobDescription('');
      setScreeningResult(null);
      setError('');
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF8F5] font-sans selection:bg-sky-100 selection:text-sky-700">
            <Navbar />
            <main className="container mx-auto px-4 py-14 max-w-5xl">
                <AnimatePresence mode="wait">
                    {screeningResult ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                        >
                           <div className="text-center mb-10">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-2">
                                Screening Telemetry
                              </div>
                              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Candidate Evaluation Report</h1>
                              <p className="mt-1 text-sm text-slate-500">AI-powered rubric match against target role parameters.</p>
                           </div>

                           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="bg-white/80 backdrop-blur-2xl border border-white/90 p-8 rounded-3xl shadow-[0_16px_40px_rgba(2,132,199,0.06)] flex flex-col items-center justify-center text-center">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Relevance Index</h2>
                                    <ScoreGauge score={screeningResult.score} />
                                    <div className="mt-5 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 font-bold text-sm">
                                      {screeningResult.verdict}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white/80 backdrop-blur-2xl border border-white/90 p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                                        <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3">
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600"/> Key Strengths
                                        </h3>
                                        <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                                            {screeningResult.strengths.map((s, i) => (
                                              <li key={i} className="flex items-start gap-2">
                                                <span className="text-emerald-500 font-bold">&bull;</span>
                                                <span>{s}</span>
                                              </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-2xl border border-white/90 p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                                        <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-3">
                                          <XCircle className="w-4 h-4 text-rose-600"/> Gaps & Growth Areas
                                        </h3>
                                        <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                                            {screeningResult.weaknesses.map((w, i) => (
                                              <li key={i} className="flex items-start gap-2">
                                                <span className="text-rose-500 font-bold">&bull;</span>
                                                <span>{w}</span>
                                              </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                           </div>

                           <div className="text-center mt-10">
                             <button 
                                onClick={handleReset} 
                                className="px-7 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_8px_20px_-4px_rgba(2,132,199,0.35)] transition-all flex items-center gap-2 mx-auto cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" /> Screen Another Candidate
                             </button>
                           </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="text-center">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3">
                                  <FileScan className="w-3.5 h-3.5 text-sky-500" /> Automated Telemetry
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">AI Resume Screener</h1>
                                <p className="mt-1 text-sm text-slate-500">Upload a candidate's resume and job description for instantaneous multi-vector matching.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 p-8 sm:p-10 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06)] space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">1. Candidate Resume (PDF)</label>
                                    <div {...getRootProps()} className={`p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                                      isDragActive ? 'border-sky-500 bg-sky-50/50' : 'border-slate-200/90 hover:border-sky-300 bg-[#FAF8F5]/60 hover:bg-white'
                                    }`}>
                                        <input {...getInputProps()} />
                                        <div className="flex flex-col items-center text-slate-500">
                                            <UploadCloud className="w-10 h-10 text-sky-500 mb-2" />
                                            <p className="text-xs sm:text-sm font-semibold text-slate-700">{file ? file.name : 'Drag & drop a PDF resume or click to select'}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Maximum size: 2MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="jobDescription" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">2. Target Job Description</label>
                                    <textarea
                                        id="jobDescription"
                                        rows="7"
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste requirements, tech stack, and responsibilities here..."
                                        className="w-full p-3.5 text-xs sm:text-sm bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all font-sans"
                                        required
                                    />
                                </div>

                                <button 
                                  type="submit" 
                                  disabled={isLoading} 
                                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isLoading ? <><LoaderCircle className="animate-spin w-4 h-4" /> Cross-Referencing Resume...</> : 'Screen Resume'}
                                </button>
                                {error && <p className="text-center text-xs font-semibold text-rose-500">{error}</p>}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}