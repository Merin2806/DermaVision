import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, FileText, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import ConditionCard from '../../components/Cards/ConditionCard';
import SeverityCard from '../../components/Cards/SeverityCard';
import DisclaimerCard from '../../components/Cards/DisclaimerCard';

const Result = ({ currentScan, onReset }) => {
  const navigate = useNavigate();

  // If no scan exists, bounce back to screen
  useEffect(() => {
    if (!currentScan) {
      navigate('/screen');
    }
  }, [currentScan, navigate]);

  if (!currentScan) return null;

  const handleRetake = () => {
    onReset();
    navigate('/screen');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl mx-auto px-6 py-12 lg:px-8 space-y-8"
    >
      {/* Header with success badge */}
      <div className="flex flex-col items-center text-center space-y-3">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="p-3 bg-emerald-50 text-success rounded-full border border-emerald-100 shadow-sm"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>
        <div>
          <h1 className="text-4xl font-serif text-accent font-black tracking-tight">Screening Complete</h1>
          <p className="text-slate-500 text-sm mt-1">
            Scan completed on {new Date(currentScan.date).toLocaleDateString()} at {new Date(currentScan.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column - Primary Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Condition card */}
          <ConditionCard 
            condition={currentScan.condition} 
            confidence={currentScan.confidence} 
          />

          {/* 2. Recommendation card */}
          <div className="glass-card rounded-custom p-8 shadow-md border border-slate-100">
            <h3 className="text-xl font-bold text-accent font-serif mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              <span>Evidence-Guided Recommendations</span>
            </h3>
            
            <ul className="space-y-4 text-slate-600 text-sm">
              {currentScan.recommendations.map((rec, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column - Severity, Image Preview & Navigation */}
        <div className="lg:col-span-4 space-y-8">
          {/* Scan image thumbnail preview */}
          {currentScan.imageUrl && (
            <div className="glass-card rounded-custom p-4 shadow-sm border border-slate-100 space-y-2.5">
              <span className="flex items-center text-xs font-bold text-accent/70 uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-primary mr-1" />
                Analyzed Image
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-150 bg-slate-50 max-h-[200px] flex items-center justify-center">
                <img 
                  src={currentScan.imageUrl} 
                  alt="Scanned Region" 
                  className="max-h-[200px] w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Severity evaluation */}
          <SeverityCard severity={currentScan.severity} />

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleRetake}
              className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-bold px-6 py-4 rounded-full shadow-md btn-glow transition-all cursor-pointer"
            >
              Upload Another Image
            </button>
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center bg-white hover:bg-slate-50 text-accent font-bold px-6 py-4 rounded-full shadow-sm border border-slate-200 transition-colors"
            >
              <span>Go To Dashboard</span>
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer warning disclaimer */}
      <DisclaimerCard />
    </motion.div>
  );
};

export default Result;
