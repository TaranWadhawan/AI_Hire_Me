// app/interview/_components/LobbyScreen.jsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, Clock, LoaderCircle, ChevronDown, Sparkles } from 'lucide-react';

const DeviceSelector = ({ icon: Icon, devices, selected, onChange }) => (
  <div className="relative flex items-center bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/60 rounded-xl shadow-lg px-2">
    <Icon className="w-4 h-4 ml-1.5 text-sky-400 pointer-events-none" />
    <select 
      value={selected} 
      onChange={onChange} 
      className="pl-3 pr-7 py-2 bg-transparent appearance-none w-full text-xs font-medium focus:outline-none cursor-pointer"
    >
      {devices.map(device => (
        <option key={device.deviceId} value={device.deviceId} className="text-slate-900">
          {device.label || `Device ${device.deviceId.substring(0, 8)}`}
        </option>
      ))}
    </select>
    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none text-slate-400" />
  </div>
);

const LobbyScreen = ({ userData, onStart, onHaveIssues }) => {
  const videoRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        const audioInputs = devices.filter(d => d.kind === 'audioinput');
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        if (videoInputs.length > 0) setSelectedVideo(videoInputs[0].deviceId);
        if (audioInputs.length > 0) setSelectedAudio(audioInputs[0].deviceId);
      } catch (err) {
        onHaveIssues("Could not access camera/mic. Please check browser permissions.");
      }
    };
    getDevices();
  }, [onHaveIssues]);

  useEffect(() => {
    if (!selectedVideo) return;
    setIsLoading(true);
    const constraints = { video: { deviceId: { exact: selectedVideo } } };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsLoading(false);
      }).catch(err => {
        onHaveIssues("Failed to switch device. It may be in use.");
        setIsLoading(false);
      });
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedVideo, onHaveIssues]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto p-8 sm:p-10 bg-white/75 backdrop-blur-2xl border border-white/90 rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.06),0_1px_3px_rgba(0,0,0,0.02)]"
    >
      {/* Session Title Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {userData.jobTitle || 'General Interview'}
            </h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200/80 px-3 py-1 rounded-full">
              {userData.difficulty || 'Medium'}
            </span>
          </div>
          <p className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-500" /> ~15 min autonomous proctored session
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-slate-200 text-xs font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Camera Check
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Left Monitor HUD */}
        <div className="md:col-span-2 bg-slate-900 rounded-2xl relative aspect-video flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
          {isLoading && <LoaderCircle className="w-8 h-8 animate-spin text-sky-400" />}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
          />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2.5 z-10">
            <DeviceSelector icon={Mic} devices={audioDevices} selected={selectedAudio} onChange={e => setSelectedAudio(e.target.value)} />
            <DeviceSelector icon={Camera} devices={videoDevices} selected={selectedVideo} onChange={e => setSelectedVideo(e.target.value)} />
          </div>
        </div>

        {/* Right Candidate Card */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-[#FAF8F5]/80 backdrop-blur-md rounded-2xl border border-slate-200/70 shadow-sm">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 text-white rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-[0_10px_25px_-5px_rgba(2,132,199,0.4)]">
              {userData.fullName ? userData.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-900">{userData.fullName || 'Candidate'}</h2>
          <p className="text-xs text-slate-500">Ready for evaluation</p>

          <motion.button 
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart} 
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_10px_25px_-5px_rgba(2,132,199,0.35)] transition-all cursor-pointer"
          >
            Launch Interview
          </motion.button>

          <button 
            onClick={() => onHaveIssues()} 
            className="w-full mt-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-white transition-all cursor-pointer"
          >
            I'm having hardware issues
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LobbyScreen;