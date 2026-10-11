// app/interview/_components/DetailsForm.jsx
'use client';
import { useState } from 'react';
import BackButton from './BackButton';
import { motion } from 'framer-motion';
import { LoaderCircle, Sparkles } from 'lucide-react';

const InputField = ({ id, label, required = true, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-sky-500">*</span>}
    </label>
    <input
      id={id}
      required={required}
      className="w-full px-3.5 py-2.5 bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all"
      {...props}
    />
  </div>
);

const DetailsForm = ({ onBack, onFormSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', linkedin: '', experience: '', jobTitle: '',
    skills: '', education: '', projects: '', targetCompany: 'Google',
  });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onFormSubmit(formData);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 220, damping: 25 }}
      className="w-full max-w-3xl mx-auto p-8 sm:p-10 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06),0_1px_3px_rgba(0,0,0,0.02)] relative"
    >
      <BackButton onClick={onBack} />
      
      <div className="text-center mt-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Profiling
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Candidate Information</h2>
        <p className="mt-1 text-sm text-slate-500">Provide details to personalize the questions and calibration rubrics.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} autoComplete="name" />
          <InputField id="email" name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} autoComplete="email" />
          <InputField id="linkedin" name="linkedin" label="LinkedIn Profile URL" type="url" value={formData.linkedin} onChange={handleChange} required={false} />
          <InputField id="experience" name="experience" label="Years of Experience" type="number" value={formData.experience} onChange={handleChange} />
          <InputField id="jobTitle" name="jobTitle" label="Desired Job Title" value={formData.jobTitle} onChange={handleChange} />
          <InputField id="skills" name="skills" label="Key Skills" placeholder="e.g. JavaScript, React, Go" value={formData.skills} onChange={handleChange} />
        </div>
        
        <InputField id="education" name="education" label="Education" placeholder="e.g. B.Tech in Computer Science" value={formData.education} onChange={handleChange} />
        
        <div>
          <label htmlFor="projects" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Notable Projects <span className="text-sky-500">*</span>
          </label>
          <textarea
            id="projects" name="projects" required rows="3"
            placeholder="Briefly describe 1-2 core projects demonstrating your engineering background."
            value={formData.projects} onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all font-sans"
          ></textarea>
        </div>
        
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-sm font-semibold rounded-2xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] hover:shadow-[0_12px_28px_-5px_rgba(2,132,199,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Initializing AI Session...
            </>
          ) : (
            'Submit and Start Interview'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DetailsForm;