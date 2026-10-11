'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  BriefcaseIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ChartBarIcon,
  Squares2X2Icon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const FeatureItem = ({ icon, title, description, variants }) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="group relative p-7 bg-white/75 backdrop-blur-xl border border-white/90 rounded-3xl shadow-[0_12px_32px_rgba(15,23,42,0.03),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.08)] transition-all"
    >
      {/* Neumorphic Inset Icon Pill */}
      <div className="flex justify-center items-center w-14 h-14 mx-auto rounded-2xl bg-[#FAF8F5] text-sky-600 border border-slate-200/60 mb-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-center text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-center text-slate-500 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

const AIInterviewAgentFeaturesSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const features = [
    {
      title: 'Role-Specific Questions',
      description: 'Our AI analyzes your saved job descriptions to generate targeted technical and behavioural questions.',
      icon: <BriefcaseIcon className="w-6 h-6" />,
    },
    {
      title: 'Video Recording',
      description: 'Record interviews with audio and video to evaluate cadence, confidence, and articulation.',
      icon: <VideoCameraIcon className="w-6 h-6" />,
    },
    {
      title: 'Live Transcription',
      description: 'Real-time neural transcription maps candidate responses into actionable structured data.',
      icon: <MicrophoneIcon className="w-6 h-6" />,
    },
    {
      title: 'Performance Analytics',
      description: 'Detailed telemetry metrics on candidate performance, speech pace, and technical relevance.',
      icon: <ChartBarIcon className="w-6 h-6" />,
    },
    {
      title: 'Multiple Interview Types',
      description: 'Run automated initial screens, technical coding checks, and cultural alignment dialogs.',
      icon: <Squares2X2Icon className="w-6 h-6" />,
    },
    {
      title: 'Instant Feedback',
      description: 'Generate comprehensive executive summaries with quantifiable competency scoring in seconds.',
      icon: <CheckCircleIcon className="w-6 h-6" />,
    },
  ];

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={controls}
      className="relative bg-gradient-to-b from-[#FAF8F5] via-sky-50/25 to-[#FAF8F5] py-28 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden"
    >
      {/* Ambient background blur elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-4 shadow-sm">
            Core Architecture
          </div>
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            AI Interview Agent Features
          </motion.h2>
          <p className="mt-3 text-slate-500 text-base">
            Equipped with proprietary evaluation models designed for modern engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variants={itemVariants}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AIInterviewAgentFeaturesSection;