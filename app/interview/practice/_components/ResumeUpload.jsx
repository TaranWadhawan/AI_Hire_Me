// app/interview/_components/ResumeUpload.jsx
'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, LoaderCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import BackButton from './BackButton';
import { motion } from 'framer-motion';

const ResumeUpload = ({ onBack, onUploadSubmit }) => {
  const [file, setFile] = useState(null);
  const [desiredPosition, setDesiredPosition] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 2 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file || !desiredPosition) {
      setError('Please upload a resume and enter your desired position.');
      return;
    }
    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('desiredPosition', desiredPosition);
    
    await onUploadSubmit(formData);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ type: 'spring', stiffness: 220, damping: 25 }}
      className="w-full max-w-lg mx-auto p-8 sm:p-10 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06),0_1px_3px_rgba(0,0,0,0.02)] relative font-sans"
    >
      <BackButton onClick={onBack} />
      
      <div className="text-center mt-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          Neural Resume Parser
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Upload Your Resume
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Our AI will parse your experience to personalize interview questions.
        </p>
        
        {/* Desired Position Input */}
        <div className="mt-6 text-left">
          <label htmlFor="desiredPosition" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Desired Position <span className="text-sky-500">*</span>
          </label>
          <input
            id="desiredPosition"
            value={desiredPosition}
            onChange={(e) => setDesiredPosition(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            className="w-full px-4 py-2.5 bg-[#FAF8F5]/80 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 text-sm border border-slate-200/80 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-4 focus:ring-sky-400/15 focus:border-sky-400 transition-all"
          />
        </div>

        {/* Dropzone Terminal */}
        <div 
          {...getRootProps()} 
          className={`mt-4 p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-sky-500 bg-sky-50/50 scale-[1.01]' 
              : file
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-200/90 hover:border-sky-300 bg-[#FAF8F5]/50 hover:bg-white/70'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              file ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-50 text-sky-600 border border-sky-100'
            }`}>
              {file ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
            </div>

            {file ? (
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PDF Attached
                </span>
                <p className="font-semibold text-xs sm:text-sm text-slate-800 break-all max-w-xs">{file.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click or drop to replace</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-semibold text-sm text-slate-800">
                  {isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume (PDF)'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Maximum file size: 2MB</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs font-semibold text-rose-500">
            {error}
          </motion.p>
        )}
        
        {/* Futuristic CTA Button */}
        <motion.button 
          onClick={handleSubmit} 
          disabled={isLoading} 
          whileHover={{ y: -1 }} 
          whileTap={{ scale: 0.98 }} 
          className="mt-6 w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-sm font-semibold rounded-2xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] hover:shadow-[0_12px_28px_-5px_rgba(2,132,199,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Parsing & Calibrating...
            </>
          ) : (
            'Continue to Lobby'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResumeUpload;