'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const AIInterviewActionSection = () => {
  const textRef = useRef(null);
  const imgRef = useRef(null);

  const textControls = useAnimation();
  const imgControls = useAnimation();

  const textInView = useInView(textRef, { once: true, margin: '-100px' });
  const imgInView = useInView(imgRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (textInView) {
      textControls.start({ opacity: 1, x: 0 });
    }
    if (imgInView) {
      imgControls.start({ opacity: 1, x: 0 });
    }
  }, [textInView, imgInView, textControls, imgControls]);

  return (
    <section className="relative bg-[#FAF8F5] py-24 overflow-hidden font-sans">
      {/* Subtle Ambient Mesh Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-4 sm:px-6 lg:px-8">
        
        {/* Left Column: Text Content */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, x: -40 }}
          animate={textControls}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 md:order-1 space-y-6"
        >
          {/* Futuristic Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 shadow-[0_2px_8px_rgba(2,132,199,0.06)]">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span className="text-xs font-semibold tracking-wider uppercase text-sky-700">Autonomous Interviewing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Take a look at our AI Interview Agent in action
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            See how our AI Interview Agent transforms your hiring process. Experience completely unbiased, efficient, and calibrated interviews with real-time feedback.
          </p>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-semibold text-sm sm:text-base shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] hover:shadow-[0_14px_30px_-5px_rgba(2,132,199,0.45)] transition-all cursor-pointer"
            >
              Learn More About AI Interviewer
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column: Glassmorphic Image Frame */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, x: 40 }}
          animate={imgControls}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 md:order-2"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="relative p-3 bg-white/70 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.08),0_1px_3px_rgba(0,0,0,0.02)]"
          >
            {/* Top decorative status bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Active Stream &bull; 60fps</span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="AiInterview-action-section-image.webp"
                alt="AI Interviewer preview terminal"
                className="object-cover w-full h-full rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AIInterviewActionSection;