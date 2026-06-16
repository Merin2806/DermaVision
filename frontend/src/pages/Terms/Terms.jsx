import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Eye, UserCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: 'Medical Disclaimer',
      desc: 'DermaVision provides AI-powered screening assistance for educational and preliminary informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.',
      icon: ShieldAlert,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      title: 'Privacy Policy',
      desc: 'Your security and privacy are of utmost importance. All user information and uploaded skin images are stored and transmitted securely. We implement industry-standard security measures, including data encryption and token-based session verification, to ensure your health indicators remain private.',
      icon: Eye,
      color: 'bg-blue-50 text-primary border-blue-100',
    },
    {
      title: 'User Responsibilities',
      desc: 'Users are responsible for providing accurate information and clear, well-lit, and in-focus images for evaluation. Providing low-quality, blurry, or misrepresentative photography can hinder the performance of quality validation systems and skew analysis results.',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'AI Limitations',
      desc: 'AI-driven analysis results are preliminary probability scores, not definitive clinical diagnoses. They are prone to margin parameters and limitations inherent in computer vision models. All analytical results should be reviewed and verified by certified healthcare professionals.',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Data Usage',
      desc: 'Uploaded lesion images and accompanying data are processed solely to perform preliminary screening checks and maintain your personal dashboard scan history. We do not sell or share your personal health or image data with unauthorized third parties.',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto px-6 py-12 lg:px-8 space-y-10"
    >
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-serif text-accent font-black tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Please read our service guidelines, data protocols, and clinical medical disclaimer below.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-custom p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className={`p-3 rounded-xl border shrink-0 ${sec.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold font-serif text-accent">{sec.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{sec.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Agreement Accent */}
      <div className="text-center py-6 border-t border-slate-150">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 text-xs font-bold text-success select-none">
          <CheckCircle2 className="w-4 h-4" />
          <span>DermaVision Regulatory Compliance Protocol V2.0</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Terms;
