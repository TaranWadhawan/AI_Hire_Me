// app/page.js
"use client";

import React, { useRef } from 'react';
import HeroSection from './_components/HeroSection';
import KeyBenefitsSection from './_components/KeyBenefitsSection';
import AIInterviewActionSection from './_components/AIInterviewActionSection';
import MasterProcessSection from './_components/MasterProcessSection';
import AIInterviewAgentFeaturesSection from './_components/AIInterviewAgentFeaturesSection';
import FAQSection from './_components/FAQSection';

export default function HomePage() {
  const faqSectionRef = useRef(null);

  return (
    <div className="bg-[#FAF8F5] text-slate-900 min-h-screen selection:bg-sky-100 selection:text-sky-700">
      <HeroSection />
      <KeyBenefitsSection />
      <AIInterviewActionSection />
      <MasterProcessSection />
      <AIInterviewAgentFeaturesSection />
      <FAQSection sectionRef={faqSectionRef} />
    </div>
  );
}