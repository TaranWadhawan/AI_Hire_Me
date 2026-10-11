'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter, Roboto_Slab } from 'next/font/google';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], display: 'swap' });

const HeroSection = () => {
    const [changingColor, setChangingColor] = useState(false);
    const [interviewLoading, setInterviewLoading] = useState(false);

    useEffect(() => {
        let timer;
        if (changingColor) {
            timer = setTimeout(() => {
                setChangingColor(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [changingColor]);

    const handleThemeChange = () => {
        setChangingColor(true);
    };

    const handleStartInterview = () => {
        setInterviewLoading(true);
        setTimeout(() => {
            setInterviewLoading(false);
            window.location.href = '/interview/practice';
        }, 2000);
    };

    const textVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 40, scale: 0.96 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <motion.div
            className="relative bg-[#FAF8F5] overflow-hidden py-16 lg:py-24 font-sans selection:bg-sky-100 selection:text-sky-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Ambient Background Gradient Glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-0" />
            <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-slate-200/50 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10">

                {/* Left Column: Text & CTAs */}
                <motion.div className="text-left relative z-10" variants={textVariants} initial="hidden" animate="visible">
                    
                    {/* Futuristic Chip Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-6">
                        <Sparkles className="w-4 h-4 text-sky-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Next-Gen Autonomous Screening</span>
                    </div>

                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] ${robotoSlab.className}`}>
                        Ace Your Next <br />
                        <span className="bg-gradient-to-r from-slate-900 via-sky-800 to-sky-600 bg-clip-text text-transparent">
                            Interview With AI.
                        </span>
                    </h1>

                    <p className={`mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl ${inter.className}`}>
                        Prepare for any engineering or product role with our AI-powered interview simulation. Receive real-time telemetry, objective competency scores, and actionable feedback.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <button
                            className={`px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-semibold text-sm shadow-[0_10px_25px_-5px_rgba(2,132,199,0.38)] hover:shadow-[0_14px_30px_-5px_rgba(2,132,199,0.48)] transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-60 ${inter.className}`}
                            onClick={handleStartInterview}
                            disabled={interviewLoading}
                        >
                            {interviewLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Preparing Interview...
                                </>
                            ) : (
                                <>
                                    Start Mock Interview
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <button 
                            className={`px-7 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 font-semibold text-sm hover:bg-white hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all cursor-pointer hover:shadow-md active:scale-95 ${inter.className}`}
                        >
                            Learn More
                        </button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-200/70">
                        <span className={`text-xs sm:text-sm font-medium text-slate-500 ${inter.className}`}>
                            Calibrated across FAANG rubrics, high-growth startups, and technical enterprises.
                        </span>
                    </div>
                </motion.div>

                {/* Right Column: Glassmorphism HUD Frame */}
                <motion.div className="relative lg:block hidden" variants={imageVariants} initial="hidden" animate="visible">
                    <div className="relative w-full aspect-square max-w-[540px] mx-auto rounded-3xl p-4 bg-white/70 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(2,132,199,0.08),0_1px_3px_rgba(0,0,0,0.02)]">
                        
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-sky-50/30">
                            <Image
                                src="/hero-section-image.avif"
                                alt="AI Interview Simulation"
                                fill
                                className="object-contain p-6"
                                priority
                            />
                        </div>

                        {/* Top Right HUD Badge (Difficulty & Job Type) */}
                        <div className="absolute top-8 right-8 bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-white/90 p-3.5 space-y-1.5">
                            <div className={`text-xs font-semibold text-slate-700 flex items-center justify-between gap-4 ${inter.className}`}>
                                <span>Difficulty</span>
                                <span className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                    Adaptive
                                </span>
                            </div>
                            <div className={`text-xs font-semibold text-slate-700 flex items-center justify-between gap-4 ${inter.className}`}>
                                <span>Session</span>
                                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Live Ready
                                </span>
                            </div>
                        </div>

                        {/* Bottom Left Floating User Pill */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-white/90 p-2.5 pr-4 flex items-center gap-3 cursor-pointer"
                            onClick={handleThemeChange}
                        >
                            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User Avatar" className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-200" />
                            <div className="text-left">
                                <span className={`block text-xs font-bold text-slate-800 ${inter.className}`}>Customized Experience</span>
                                <span className="text-[10px] text-slate-400 font-medium">Click to calibrate</span>
                            </div>
                        </motion.button>

                        {/* Bottom Right AI Status Indicator */}
                        <AnimatePresence mode="wait">
                            {changingColor ? (
                                <motion.div
                                    key="calibrating"
                                    className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_25px_rgba(2,132,199,0.12)] border border-sky-200 p-3"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <span className={`flex items-center gap-2 text-sky-600 text-xs font-bold ${inter.className}`}>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Calibrating Model...
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="ready"
                                    className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-white/90 p-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <span className={`flex items-center gap-2 text-xs font-semibold text-slate-700 ${inter.className}`}>
                                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                                        AI Analyzing
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Mobile Fallback Graphic */}
                <div className="lg:hidden absolute inset-0 opacity-10 z-0 pointer-events-none">
                    <Image
                        src="/hero-section-image.avif"
                        alt="AI Interview Simulation"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default HeroSection;