'use client';

import { useEffect, useRef } from 'react';
import { Inter } from 'next/font/google';
import {
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import { motion, useAnimation, useInView } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

const IconFeatureCard = ({ title, description, icon, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative rounded-3xl p-7 bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_12px_32px_rgba(15,23,42,0.03),0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(2,132,199,0.09)] transition-all"
    >
      <div className="flex flex-col items-center text-center">
        {/* Neumorphic Inset Icon Well */}
        <div className="w-16 h-16 mb-5 rounded-2xl bg-[#FAF8F5] text-sky-600 border border-slate-200/60 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-sky-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
          {icon}
        </div>
        <h3 className={`text-lg font-bold mb-2 text-slate-800 group-hover:text-sky-600 transition-colors ${inter.className}`}>
          {title}
        </h3>
        <p className={`text-sm text-slate-500 leading-relaxed ${inter.className}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const KeyFeatureSection = () => {
  const features = [
    {
      title: "AI-Powered Questioning",
      description:
        "Simulate realistic interview scenarios with dynamic, role-tailored questions adapted to your answers.",
      icon: <ChatBubbleLeftRightIcon className="h-7 w-7 transition-colors" />,
    },
    {
      title: "Instant Performance Feedback",
      description:
        "Receive real-time analysis of technical answers, cadence, and behavioral structure after every prompt.",
      icon: <BeakerIcon className="h-7 w-7 transition-colors" />,
    },
    {
      title: "Customizable Interview Settings",
      description:
        "Fine-tune difficulty parameters, seniority level, and target engineering stack for customized practice.",
      icon: <Cog6ToothIcon className="h-7 w-7 transition-colors" />,
    },
  ];

  return (
    <div className="relative bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-200/60 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-72 bg-sky-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 shadow-sm">
            Core Advantages
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight ${inter.className}`}>
            Practice Smarter, Interview Better
          </h2>
          <p className={`mt-3 text-base text-slate-500 leading-relaxed ${inter.className}`}>
            Sharpen your communication skills, build confidence, and get objective data-driven insights tailored to your target position.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <IconFeatureCard key={index} index={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyFeatureSection;