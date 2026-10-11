'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Element } from 'react-scroll';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: 'How does the AI evaluate candidates?',
      answer:
        'Our AI uses natural language processing and machine learning models to assess communication skills, technical accuracy, and behavioral responses.',
    },
    {
      question: 'Is the interview process customizable for different roles?',
      answer:
        'Yes! You can fully customize question sets, evaluation criteria, and difficulty levels for specific job roles.',
    },
    {
      question: 'Does the AI support multiple languages?',
      answer:
        'Yes, we support multiple languages for both questions and answers, making it ideal for global teams.',
    },
    {
      question: 'Can we integrate it with our ATS (Applicant Tracking System)?',
      answer:
        'Definitely. We offer integrations with popular ATS platforms like Greenhouse, Lever, Workable, and more.',
    },
    {
      question: 'What kind of reports or analytics do we get?',
      answer:
        'You get comprehensive performance reports, comparison metrics, and AI-driven hiring recommendations.',
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <Element name="faq">
      <div className="relative bg-[#FAF8F5] py-24 overflow-hidden font-sans border-t border-slate-200/60">
        
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start gap-12 lg:gap-16">
          
          {/* Left Column Header Info */}
          <div className="md:w-5/12 w-full md:sticky md:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-4 shadow-sm">
              Knowledge Base
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Everything you need to know about setting up, configuring, and analyzing candidates with Quantix AI.
            </p>

            <div className="hidden md:block relative h-64 w-full rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_12px_30px_rgba(2,132,199,0.06)] p-4">
              <Image
                src="/FAQ-section-image.avif"
                alt="FAQ graphic"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </div>

          {/* Right Column: Glassmorphic Accordion */}
          <div className="md:w-7/12 w-full space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = expandedIndex === index;
              return (
                <motion.div
                  key={index}
                  variants={faqVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  custom={index}
                  onClick={() => toggleFAQ(index)}
                  className={`cursor-pointer rounded-2xl transition-all duration-300 p-5 backdrop-blur-xl ${
                    isOpen
                      ? 'bg-white/90 border border-sky-200 shadow-[0_10px_25px_rgba(2,132,199,0.06)] ring-2 ring-sky-400/10'
                      : 'bg-white/70 hover:bg-white/90 border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h3 className={`text-base font-semibold transition-colors ${isOpen ? 'text-sky-700' : 'text-slate-800'}`}>
                      {faq.question}
                    </h3>
                    <div className={`p-1 rounded-lg transition-transform duration-300 ${isOpen ? 'rotate-180 bg-sky-100 text-sky-600' : 'text-slate-400'}`}>
                      <ChevronDownIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3.5 pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </Element>
  );
};

export default FAQSection;