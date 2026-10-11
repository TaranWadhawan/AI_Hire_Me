// app/interview/_components/BackButton.jsx
'use client';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-500 hover:text-sky-600 hover:border-sky-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all group z-10 text-xs font-semibold"
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
      <span>Back</span>
    </motion.button>
  );
};

export default BackButton;