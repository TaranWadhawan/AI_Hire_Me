// _components/FeatureItem.js
import React from 'react';

const FeatureItem = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white/75 backdrop-blur-xl border border-white/90 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_rgba(2,132,199,0.08)] transition-all">
    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-[#FAF8F5] text-sky-600 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
      {icon}
    </div>
    <h4 className="text-lg font-bold mb-1.5 text-slate-800">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default FeatureItem;