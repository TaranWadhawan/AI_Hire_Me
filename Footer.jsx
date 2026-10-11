// _components/FooterSection.js
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="relative bg-[#FAF8F5] border-t border-slate-200/70 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Ambient Futuristic Glow Mesh */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      <div className="absolute left-1/2 -bottom-20 -translate-x-1/2 w-[500px] h-40 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Left: Brand & Telemetry Status Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-sky-500" />
              Quantix AI Engine &bull; Operational
            </span>
          </motion.div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            &copy; 2025 Vision_Coders Team. All rights reserved.
          </p>
        </div>

        {/* Right: Glassmorphic Navigation & Legal Links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-500">
          <motion.div whileHover={{ y: -1 }}>
            <Link 
              href="#" 
              className="hover:text-sky-600 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
          </motion.div>
          <span className="text-slate-300">&bull;</span>
          <motion.div whileHover={{ y: -1 }}>
            <Link 
              href="#" 
              className="hover:text-sky-600 transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>
          </motion.div>
          <span className="text-slate-300">&bull;</span>
          <motion.div whileHover={{ y: -1 }}>
            <Link 
              href="/contact" 
              className="hover:text-sky-600 transition-colors underline-offset-4 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              Compliance
            </Link>
          </motion.div>
        </div>

      </div>
    </footer>
  );
};

export default FooterSection;