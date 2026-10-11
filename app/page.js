// app/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Video, 
  FileScan, 
  Home, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  HelpCircle 
} from 'lucide-react';

const portals = [
  {
    title: 'Platform Overview',
    description: 'Explore features, model rubrics, and automated enterprise workflows.',
    href: '/home',
    icon: Home,
    badge: 'Core Hub',
    cta: 'Enter Home',
  },
  {
    title: 'Autonomous AI Interview',
    description: 'Launch an interactive, proctored mock interview with neural feedback.',
    href: '/interview',
    icon: Video,
    badge: 'Proctored',
    cta: 'Start Session',
    featured: true,
  },
  {
    title: 'Resume Screening',
    description: 'Upload candidate resumes to get instant multi-vector match scores.',
    href: '/resume-screening',
    icon: FileScan,
    badge: 'Telemetry',
    cta: 'Screen Resume',
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F5] flex flex-col justify-between p-4 sm:p-6 lg:p-10 overflow-hidden font-sans selection:bg-sky-100 selection:text-sky-700">
      
      {/* Ambient Animated Mesh Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 45, 0],
            y: [0, -35, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-sky-200/50 via-sky-100/35 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -right-40 w-[620px] h-[620px] bg-gradient-to-tl from-slate-200/60 via-sky-100/30 to-amber-50/50 rounded-full blur-3xl"
        />
      </div>

      {/* Top Header Badge */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-sky-500" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">Quantix AI</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
          <Link href="/hr/schedule" className="hover:text-sky-600 transition-colors flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Schedule
          </Link>
          <span className="text-slate-300">&bull;</span>
          <Link href="/tests" className="hover:text-sky-600 transition-colors flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Quizzes
          </Link>
        </div>
      </header>

      {/* Main Hero & Portals */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-12 text-center">
        
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Autonomous Talent Evaluation</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
        >
          Next-Generation <br />
          <span className="bg-gradient-to-r from-slate-900 via-sky-800 to-sky-600 bg-clip-text text-transparent">
            AI Hiring & Screening Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Select a terminal to initiate candidate evaluations, run proctored mock interview sessions, or analyze resumes with deep neural rubrics.
        </motion.p>

        {/* 3 Portal Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left"
        >
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.title}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col justify-between p-8 rounded-3xl backdrop-blur-2xl transition-all duration-300 ${
                  portal.featured
                    ? 'bg-white/95 border-2 border-sky-400 shadow-[0_20px_50px_rgba(2,132,199,0.12)] ring-4 ring-sky-400/10'
                    : 'bg-white/75 hover:bg-white/90 border border-white/90 shadow-[0_12px_36px_rgba(15,23,42,0.03)]'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    portal.featured 
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                      : 'bg-[#FAF8F5] text-sky-600 border border-slate-200/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    portal.featured
                      ? 'bg-sky-100 text-sky-700 border border-sky-200'
                      : 'bg-[#FAF8F5] text-slate-500 border border-slate-200/70'
                  }`}>
                    {portal.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{portal.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed mb-8">
                    {portal.description}
                  </p>
                </div>

                <Link
                  href={portal.href}
                  className={`w-full py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    portal.featured
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-[0_8px_20px_-4px_rgba(2,132,199,0.4)]'
                      : 'bg-[#FAF8F5] hover:bg-white text-slate-700 border border-slate-200/80 shadow-sm'
                  }`}
                >
                  <span>{portal.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center py-4 border-t border-slate-200/60">
        <p className="text-xs text-slate-400 font-medium">
          Quantix AI Engine &bull; Minimalist &bull; Glassmorphic &bull; Neumorphic Interface
        </p>
      </footer>

    </div>
  );
}