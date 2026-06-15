import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SeverityCard = ({ severity }) => {
  // Map severity string to indicator parameters
  let activeIndex = 0; // 0 for Mild, 1 for Moderate, 2 for Severe
  let color = 'text-success';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let barGradient = 'from-emerald-400 via-amber-400 to-rose-400';
  let pointerLeft = '16.66%'; // centered in Mild section (0% to 33.33%)
  let Icon = CheckCircle2;
  let description = 'This condition is showing mild localized characteristics. Follow standard hygiene and skin care routines.';

  if (severity === 'Moderate') {
    activeIndex = 1;
    color = 'text-warning';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    pointerLeft = '50%'; // centered in Moderate section (33.33% to 66.66%)
    Icon = AlertCircle;
    description = 'Moderate characteristics detected. Keep monitoring the area and consider scheduling a consult with a medical professional.';
  } else if (severity === 'Severe') {
    activeIndex = 2;
    color = 'text-danger';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    pointerLeft = '83.33%'; // centered in Severe section (66.66% to 100%)
    Icon = ShieldAlert;
    description = 'Severe structural skin patterns detected. Prompt professional evaluation by a licensed dermatologist is highly recommended.';
  }

  return (
    <div className="glass-card rounded-custom p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-accent font-serif mb-1">Severity Assessment</h3>
          <p className="text-xs text-slate-400 font-sans tracking-wide uppercase">AI Classified Progression</p>
        </div>
        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{severity}</span>
        </span>
      </div>

      {/* Meter Bar */}
      <div className="relative mb-8 pt-4">
        {/* Track */}
        <div className={`h-3 w-full rounded-full bg-gradient-to-r ${barGradient} opacity-90`}></div>
        
        {/* Hover segments separator guidelines */}
        <div className="absolute top-4 left-1/3 w-0.5 h-3 bg-white/60"></div>
        <div className="absolute top-4 left-2/3 w-0.5 h-3 bg-white/60"></div>

        {/* Floating Indicator Arrow */}
        <motion.div 
          className="absolute -top-1 flex flex-col items-center" 
          style={{ left: pointerLeft }}
          initial={{ transform: 'translateX(-50%) scale(0.5)', opacity: 0 }}
          animate={{ transform: 'translateX(-50%) scale(1)', opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
        >
          <div className="w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md"></div>
          <div className="w-1.5 h-1.5 bg-accent transform rotate-45 -mt-0.5"></div>
        </motion.div>
      </div>

      {/* Section Names */}
      <div className="grid grid-cols-3 text-center text-xs font-semibold tracking-wide uppercase text-slate-400 mb-6">
        <div className={activeIndex === 0 ? 'text-success font-bold' : ''}>Mild</div>
        <div className={activeIndex === 1 ? 'text-warning font-bold' : ''}>Moderate</div>
        <div className={activeIndex === 2 ? 'text-danger font-bold' : ''}>Severe</div>
      </div>

      <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
        {description}
      </p>
    </div>
  );
};

export default SeverityCard;
