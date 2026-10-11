// app/interview/_components/Selection.jsx
'use client';
import { UploadCloud, PenSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

const Selection = ({ onSelectUpload, onSelectForm }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="text-center w-full max-w-4xl px-4 mx-auto font-sans"
    >
      {/* Telemetry Badge */}
      <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-sky-500" />
        Autonomous Candidate Terminal
      </motion.div>

      <motion.h1 
        variants={itemVariants} 
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight"
      >
        Prepare for Your AI Interview
      </motion.h1>

      <motion.p 
        variants={itemVariants} 
        className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
      >
        Select how you would like to initiate your session. Your experience will be tailored with role-specific questions and proctoring.
      </motion.p>

      {/* Mode Selection Cards */}
      <motion.div 
        variants={itemVariants}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Upload Resume Card */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-100 border border-sky-200 text-sky-700 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full z-10 shadow-sm">
            Recommended
          </div>
          
          <button 
            onClick={onSelectUpload} 
            className="w-full h-full p-8 sm:p-9 border border-white/90 rounded-3xl bg-white/75 backdrop-blur-2xl text-center transition-all duration-300 shadow-[0_12px_36px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.1)] hover:border-sky-300 cursor-pointer"
          >
            <div className="w-16 h-16 mx-auto bg-[#FAF8F5] text-sky-600 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white group-hover:border-transparent">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="mt-6 font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
              Upload from Resume
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              We'll auto-extract your skills, education, and experience to generate targeted questions.
            </p>
          </button>
        </motion.div>

        {/* Start from Scratch Card */}
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <button 
            onClick={onSelectForm} 
            className="w-full h-full p-8 sm:p-9 border border-white/90 rounded-3xl bg-white/75 backdrop-blur-2xl text-center transition-all duration-300 shadow-[0_12px_36px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.1)] hover:border-sky-300 cursor-pointer"
          >
            <div className="w-16 h-16 mx-auto bg-[#FAF8F5] text-sky-600 border border-slate-200/60 rounded-2xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white group-hover:border-transparent">
              <PenSquare className="w-7 h-7" />
            </div>
            <p className="mt-6 font-bold text-lg text-slate-900 group-hover:text-sky-600 transition-colors">
              Start from Scratch
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Manually fill out your profile details and role preferences for custom calibration.
            </p>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Selection;