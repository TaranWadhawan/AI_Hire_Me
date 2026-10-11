// app/interview/_components/Toast.jsx
'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

const icons = {
  info: <Info className="w-4 h-4 text-sky-500" />,
  error: <AlertTriangle className="w-4 h-4 text-rose-500" />,
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
};

const Toast = ({ notification, onClear }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClear();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClear]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_16px_40px_rgba(2,132,199,0.1),0_1px_3px_rgba(0,0,0,0.03)] border border-white/90 text-xs font-semibold text-slate-800 pointer-events-auto">
            <div className="p-1 rounded-lg bg-[#FAF8F5] border border-slate-200/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
              {icons[notification.type] || icons.info}
            </div>
            <p className="pr-1">{notification.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;