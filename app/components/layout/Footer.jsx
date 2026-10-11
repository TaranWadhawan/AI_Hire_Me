// _components/FooterSection.js
import React from 'react';
import Link from 'next/link';

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#FAF8F5] border-t border-slate-200/70 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Ambient glass blur glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
      <div className="absolute left-1/2 -bottom-24 -translate-x-1/2 w-96 h-48 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Telemetry Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Quantix AI Engine</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {currentYear} Vision_Coders Team. All rights reserved.
          </p>
        </div>

        {/* Links with Light Blue Hover */}
        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <Link href="/privacy" className="hover:text-sky-600 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300">&bull;</span>
          <Link href="/terms" className="hover:text-sky-600 transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-300">&bull;</span>
          <Link href="/contact" className="hover:text-sky-600 transition-colors">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;