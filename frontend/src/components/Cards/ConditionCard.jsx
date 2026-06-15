import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ConditionCard = ({ condition, confidence }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="glass-card rounded-custom p-8 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl -z-10"></div>
      
      <div className="mb-6 md:mb-0 text-center md:text-left">
        <span className="inline-flex items-center space-x-1 bg-blue-50 text-[#1E3A5F] px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Primary Assessment</span>
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-accent font-bold leading-tight mb-2">
          {condition}
        </h2>
        <p className="text-slate-500 text-sm max-w-sm">
          Our deep learning model has matched your uploaded image with dataset patterns corresponding to {condition}.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Circular Progress Ring */}
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              stroke="#E1EEFC"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Foreground Circle */}
            <motion.circle
              stroke="#4A9DE8"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          {/* Inner Percentage */}
          <div className="absolute text-center">
            <span className="text-2xl font-bold text-accent">{confidence}%</span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionCard;
