import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, FileText, Image as ImageIcon, AlertTriangle, Stethoscope } from 'lucide-react';
import ConditionCard from '../../components/Cards/ConditionCard';
import SeverityCard from '../../components/Cards/SeverityCard';
import DisclaimerCard from '../../components/Cards/DisclaimerCard';
import PipelineCards from '../../components/Cards/PipelineCards';
import ConfidenceCard from '../../components/Cards/ConfidenceCard';

const Result = ({ currentScan, onReset }) => {
  const navigate = useNavigate();

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

  const defaultConsultationReasons = [
    "Rapidly spreading lesions or sudden changes in color, size, or shape.",
    "Severe itching, pain, bleeding, or fluid discharge from affected skin areas.",
    "Lack of improvement after several weeks of standard care.",
    "Lesions accompanied by fever, persistent discomfort, or systemic symptoms."
  ];

  const consultDoctorList = (currentScan.consultDoctor && currentScan.consultDoctor.length > 0)
    ? currentScan.consultDoctor
    : defaultConsultationReasons;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-6xl mx-auto px-6 py-12 lg:px-8 space-y-8"
    >
      {/* ----------------------------------------------------
          1. HEADER (Centered)
         ---------------------------------------------------- */}
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
          <h1 className="text-4xl font-serif text-accent font-black tracking-tight">AI Screening Report</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Scan completed on {new Date(currentScan.date).toLocaleDateString()} at {new Date(currentScan.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. SUMMARY SECTION (Two-column Grid)
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Condition Card & Confidence Card */}
        <div className="space-y-6">
          <ConditionCard condition={currentScan.condition} />
          <ConfidenceCard confidence={currentScan.confidence} />
        </div>

        {/* Right Column: Uploaded Image Preview & Severity Card */}
        <div className="space-y-6">
          {/* Uploaded Image Preview */}
          {currentScan.imageUrl && (
            <div className="glass-card rounded-custom p-6 shadow-sm border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center text-xs font-bold text-accent/80 uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4 text-primary mr-2" />
                  Uploaded Scan Image
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Original Input
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-150 bg-slate-50 max-h-[260px] flex items-center justify-center">
                <img 
                  src={currentScan.imageUrl} 
                  alt="Scanned Region" 
                  className="max-h-[260px] w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Severity Evaluation Card */}
          <SeverityCard severity={currentScan.severity} />

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleRetake}
              className="flex-1 inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-bold px-6 py-3.5 rounded-full shadow-md btn-glow transition-all cursor-pointer text-sm"
            >
              Upload Another Image
            </button>
            <Link
              to="/dashboard"
              className="flex-1 inline-flex items-center justify-center bg-white hover:bg-slate-50 text-accent font-bold px-6 py-3.5 rounded-full shadow-sm border border-slate-200 transition-colors text-sm"
            >
              <span>Go To Dashboard</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          3. CLINICAL PROFILE (Full Width)
         ---------------------------------------------------- */}
      {currentScan.description && (
        <div className="glass-card rounded-custom p-8 shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xl font-bold text-accent font-serif flex items-center">
            <Stethoscope className="w-6 h-6 mr-2 text-primary" />
            Clinical Profile & Overview
          </h3>
          <p className="text-slate-600 text-base leading-relaxed">
            {currentScan.description}
          </p>
        </div>
      )}

      {/* ----------------------------------------------------
          4. AI ANALYSIS PIPELINE (Full Width)
         ---------------------------------------------------- */}
      <PipelineCards currentScan={currentScan} />

      {/* ----------------------------------------------------
          5. RECOMMENDATIONS (Full Width)
         ---------------------------------------------------- */}
      <div className="glass-card rounded-custom p-8 shadow-md border border-slate-100 space-y-6">
        <h3 className="text-xl font-bold text-accent font-serif flex items-center">
          <FileText className="w-6 h-6 mr-2.5 text-primary" />
          <span>Evidence-Guided Precautions & Home Care</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(currentScan.recommendations || []).map((rec, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-start space-x-3.5 bg-slate-50/80 p-4 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="w-7 h-7 rounded-full bg-blue-50 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-100">
                {index + 1}
              </span>
              <span className="text-slate-600 text-sm leading-relaxed">{rec}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------
          6. WHEN TO CONSULT A DERMATOLOGIST (Full Width)
         ---------------------------------------------------- */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-custom p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-amber-900">
            When to Consult a Dermatologist
          </h3>
        </div>
        <ul className="space-y-3.5 text-sm text-amber-800 font-medium pt-2">
          {consultDoctorList.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ----------------------------------------------------
          7. MEDICAL DISCLAIMER
         ---------------------------------------------------- */}
      <DisclaimerCard />
    </motion.div>
  );
};

export default Result;
