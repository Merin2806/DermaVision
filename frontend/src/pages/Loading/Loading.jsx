import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoImg from '../../assets/logo/logo.png';
import { Sparkles } from 'lucide-react';

const Loading = () => {
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  
  const pipelineLogs = [
    'Initializing neural network layers...',
    'Performing histogram equalization and color correction...',
    'Extracting region-of-interest bounding coordinates...',
    'Passing features to MobileNetV2 and EfficientNetB0 models...',
    'Evaluating confidence ratios against clinical database metrics...',
    'Classifying structural borders and lesion severity scales...',
    'Formatting diagnostic recommendations report...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => {
        if (prev < pipelineLogs.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7FBFF] flex flex-col items-center justify-center p-6">
      {/* Decorative backdrop shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-50/70 blur-3xl -z-10 animate-pulse"></div>

      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
        
        {/* Floating Animated Logo Outer Ring */}
        <div className="relative">
          <motion.div 
            className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/45"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
          />
          <motion.div 
            className="absolute -inset-2 rounded-full border-2 border-primary/20 bg-primary/5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="relative bg-white p-5 rounded-3xl shadow-xl border border-white"
          >
            <img 
              src={logoImg} 
              alt="DermaVision Logo" 
              className="w-16 h-16 object-contain"
            />
          </motion.div>
        </div>

        {/* Loading Headings */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-accent font-serif tracking-tight flex items-center justify-center space-x-1.5">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span>Analyzing Skin Structure</span>
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Please wait while the AI pipeline processes your image...
          </p>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-blue-100/40 h-2 rounded-full overflow-hidden border border-blue-100/10">
          <motion.div 
            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '95%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Sequential Logs Terminal */}
        <div className="w-full bg-slate-900/95 text-slate-300 font-mono text-[11px] p-5 rounded-custom text-left shadow-lg border border-slate-800 space-y-2.5 h-[160px] overflow-y-auto flex flex-col justify-end">
          {pipelineLogs.slice(0, activeLogIndex + 1).map((log, idx) => {
            const isLast = idx === activeLogIndex;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start ${isLast ? 'text-primary' : 'text-slate-400'}`}
              >
                <span className="text-primary mr-2 select-none shrink-0">&gt;</span>
                <span className="leading-relaxed">{log}</span>
              </motion.div>
            );
          })}
          {activeLogIndex < pipelineLogs.length - 1 && (
            <div className="w-1.5 h-3 bg-primary animate-pulse ml-4 mt-0.5 inline-block shrink-0"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loading;
