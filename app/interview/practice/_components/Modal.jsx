// app/interview/_components/Modal.jsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Frosted Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/25 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Neumorphic & Glass Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            className="relative w-full max-w-md p-7 bg-white/85 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_25px_60px_rgba(2,132,199,0.08),0_1px_3px_rgba(0,0,0,0.02)] z-10"
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-slate-200/80 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;