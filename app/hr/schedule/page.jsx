'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/app/components/layout/Navbar';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, Calendar, Mail, Building, Briefcase, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SchedulePage() {
  const [candidateEmail, setCandidateEmail] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setHrEmail(session.user.email);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateEmail, hrEmail, jobTitle, companyName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans selection:bg-sky-100 selection:text-sky-700">
      <Navbar />

      <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 overflow-hidden">
        {/* Ambient Animated Mesh Orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg p-8 sm:p-10 bg-white/75 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06),0_1px_3px_rgba(0,0,0,0.02)]"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Automated Dispatch
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Schedule AI Interview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure parameters and send an interactive interview invitation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField 
              icon={Building} 
              label="Company Name" 
              type="text" 
              placeholder="e.g. Acme Labs"
              value={companyName} 
              onChange={e => setCompanyName(e.target.value)} 
            />
            <InputField 
              icon={Briefcase} 
              label="Job Title" 
              type="text" 
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle} 
              onChange={e => setJobTitle(e.target.value)} 
              required 
            />
            <InputField 
              icon={Mail} 
              label="Candidate's Email" 
              type="email" 
              placeholder="candidate@domain.com"
              value={candidateEmail} 
              onChange={e => setCandidateEmail(e.target.value)} 
              required 
            />
            <InputField 
              icon={Calendar} 
              label="Your Email (for reports)" 
              type="email" 
              placeholder="hr@domain.com"
              value={hrEmail} 
              onChange={e => setHrEmail(e.target.value)} 
              required 
            />

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 active:from-sky-600 text-white text-sm font-semibold rounded-2xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] hover:shadow-[0_12px_28px_-5px_rgba(2,132,199,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Token & Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </motion.button>

            {/* Status alerts */}
            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-50/80 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{message}</span>
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-rose-50/80 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

const InputField = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
      {label}{props.required && <span className="text-sky-500 ml-0.5">*</span>}
    </label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-4 py-2.5 bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all`}
      />
    </div>
  </div>
);