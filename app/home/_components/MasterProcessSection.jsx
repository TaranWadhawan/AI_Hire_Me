'use client';

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

const steps = [
  {
    title: 'Set Up Your Process',
    description:
      'Select from different hiring formats and let our AI customize the process for your target role.',
  },
  {
    title: 'Practice Screening',
    description:
      'Have efficient resume screening with AI at your own pace.',
  },
  {
    title: 'Get Instant Feedback',
    description:
      'Receive detailed performance insights and actionable recommendations after each screening session.',
  },
  {
    title: 'Build Confidence',
    description:
      'Review your screening records, track your improvement, and prepare effectively for real hiring.',
  },
];

const MasterProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const { ref: sectionRef, inView: sectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const handleStepClick = (index) => {
    setActiveStep(index);
    scrollToStep(index);
  };

  const scrollToStep = (index) => {
    if (!containerRef.current) return;
    const stepWidth = containerRef.current.children[0]?.offsetWidth || 288;
    const newScrollPosition = stepWidth * index;
    containerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    scrollToStep(activeStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    scrollToStep(activeStep - 1);
  };

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const activeElement = container.children[activeStep];

      if (activeElement) {
        const containerWidth = container.offsetWidth;
        const elementWidth = activeElement.offsetWidth;
        const scrollPosition = activeElement.offsetLeft - (containerWidth - elementWidth) / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [activeStep]);

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F5] py-24 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-200/60 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 shadow-sm">
          Workflow
        </div>
        <motion.h2
          variants={variants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Our Streamlined Process
        </motion.h2>
        <motion.p
          variants={variants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          className="mt-3 text-slate-500 max-w-2xl mx-auto text-base"
        >
          Experience a frictionless journey with our AI-powered screening process. Follow these simple steps to prepare or evaluate candidates with precision.
        </motion.p>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Navigation Arrows (Neumorphic Buttons) */}
        <button
          onClick={handlePrev}
          disabled={activeStep === 0}
          aria-label="Previous step"
          className={clsx(
            'absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-slate-700 p-3 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-slate-200/80 transition-all hover:bg-white active:scale-95 z-20',
            { 'opacity-40 cursor-not-allowed hover:bg-white/90': activeStep === 0 }
          )}
        >
          <IoIosArrowBack size={20} />
        </button>

        <button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          aria-label="Next step"
          className={clsx(
            'absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-slate-700 p-3 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-slate-200/80 transition-all hover:bg-white active:scale-95 z-20',
            { 'opacity-40 cursor-not-allowed hover:bg-white/90': activeStep === steps.length - 1 }
          )}
        >
          <IoIosArrowForward size={20} />
        </button>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="overflow-x-auto scrollbar-none flex gap-5 py-6 px-12 justify-start md:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <motion.div
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={clsx(
                  'relative flex flex-col justify-between p-7 w-72 min-w-[18rem] cursor-pointer transition-all duration-300 rounded-2xl backdrop-blur-xl',
                  isActive
                    ? 'bg-white/95 border-2 border-sky-400 shadow-[0_16px_36px_rgba(2,132,199,0.12)]'
                    : 'bg-white/70 hover:bg-white/90 border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.03)]'
                )}
                style={{
                  clipPath:
                    idx === 0
                      ? 'polygon(0 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 0 100%)'
                      : idx === steps.length - 1
                        ? 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)'
                        : 'polygon(12px 0, 100% 0, calc(100% - 12px) 50%, 100% 100%, 12px 100%, 0 50%)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={clsx(
                      'h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-all',
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                        : 'bg-[#FAF8F5] text-slate-500 border border-slate-200/80'
                    )}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                <div>
                  <h3
                    className={clsx(
                      'text-base font-bold mb-2 transition-colors',
                      isActive ? 'text-sky-700' : 'text-slate-800'
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Active Indicator Underline */}
                {isActive && (
                  <motion.div
                    layoutId="active-process-underline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-t-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MasterProcessSection;