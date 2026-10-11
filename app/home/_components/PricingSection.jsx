"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Element } from 'react-scroll';
import { Check } from 'lucide-react';

const PricingCard = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedCard, setSelectedCard] = useState(1);

  useEffect(() => {
    setSelectedCard(1);
  }, []);

  const togglePricing = () => {
    setIsYearly(!isYearly);
  };

  const freePlan = {
    title: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceSuffix: 'user/month',
    description: 'For individuals exploring AI practice',
    features: [
      'Access to core interview practice',
      'Up to 3 interviews per month',
      'Basic response transcriptions',
      'Standard email support',
    ],
    badge: 'Starter',
    isPopular: false,
  };

  const premiumPlan = {
    title: 'Premium',
    monthlyPrice: 45,
    yearlyPrice: 450,
    priceSuffix: 'user/month',
    description: 'Best for active candidates & small teams',
    features: [
      'Everything in Starter',
      'Unlimited AI mock screenings',
      'In-depth competency & metric scoring',
      'Real-time proctoring telemetry',
      'Priority chat support',
    ],
    badge: 'Most Popular',
    isPopular: true,
  };

  const platinumPlan = {
    title: 'Platinum',
    monthlyPrice: 75,
    yearlyPrice: 750,
    priceSuffix: 'user/month',
    description: 'Designed for scaling engineering teams',
    features: [
      'Everything in Premium',
      'Custom rubric calibration',
      'ATS & Webhook integrations',
      'Unlimited team seats',
      'Dedicated recruitment partner',
    ],
    badge: 'Enterprise',
    isPopular: false,
  };

  const planCards = [freePlan, premiumPlan, platinumPlan];

  const getPrice = (plan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <Element name="pricing">
      <div className="relative min-h-screen bg-[#FAF8F5] py-24 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center border-t border-slate-200/60 overflow-hidden">
        
        {/* Ambient Gradient Meshes */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-sky-100/50 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 shadow-sm">
            Predictable Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Flexible Plans for Everyone
          </h2>
          <p className="mt-3 text-slate-500 text-base">
            Choose the tier that matches your career acceleration or team recruitment scale.
          </p>
        </div>

        {/* Neumorphic Billing Toggle */}
        <div className="relative z-10 flex items-center mb-14 p-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${!isYearly ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600'}`}>
            Monthly
          </span>
          <label className="inline-flex relative items-center cursor-pointer mx-1">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isYearly}
              onChange={togglePricing}
            />
            <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500 shadow-inner"></div>
          </label>
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${isYearly ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="ml-2 mr-3 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 bg-sky-100 rounded-full">
              Save 20%
            </span>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-6xl w-full">
          {planCards.map((plan, index) => {
            const isSelected = selectedCard === index;
            return (
              <motion.div
                key={index}
                onClick={() => handleCardClick(index)}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col justify-between w-full lg:w-96 rounded-3xl p-8 backdrop-blur-2xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-white/95 border-2 border-sky-400 shadow-[0_20px_50px_rgba(2,132,199,0.12)] ring-4 ring-sky-400/10'
                    : 'bg-white/75 hover:bg-white/90 border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)]'
                }`}
              >
                {/* Popular Pill */}
                {isSelected && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md shadow-sky-500/25">
                    {plan.badge || 'Recommended'}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{plan.title}</h3>
                    {!isSelected && plan.badge && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                      ${getPrice(plan)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 ml-1.5">
                      /{plan.priceSuffix}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="w-full h-px bg-slate-100 mb-6" />

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs sm:text-sm text-slate-600 gap-2.5">
                        <div className="p-0.5 rounded-full bg-sky-50 text-sky-600 mt-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={`w-full py-3.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
                    isSelected
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white shadow-[0_8px_20px_-4px_rgba(2,132,199,0.4)]'
                      : 'bg-[#FAF8F5] text-slate-700 hover:bg-white border border-slate-200/80'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Element>
  );
};

export default PricingCard;