import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Target, AlertTriangle, Lightbulb, CheckCircle2, 
  ChevronDown, Sparkles, ShieldCheck, Activity, Award, 
  Cpu, Lock, FileText, Shield, Zap, Smartphone, 
  Search, Database, Check
} from 'lucide-react';

// Custom AI Healthcare Vector Illustration Component
const AIHealthcareIllustration = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center p-2 sm:p-4">
      {/* Outer Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent rounded-full blur-3xl -z-10"></div>
      
      {/* Decorative Floating Card 1 - AI Scan Result */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 z-20 glass-card px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg border border-white/80 flex items-center space-x-3 bg-white/90"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Computer Vision</p>
          <p className="text-xs font-bold text-accent">97.5% Match Confidence</p>
        </div>
      </motion.div>

      {/* Decorative Floating Card 2 - Doctor Dashboard Badge */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: [6, -6, 6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-20 glass-card px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-lg border border-white/80 flex items-center space-x-3 bg-white/90"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">Dermatologist Dashboard</p>
          <p className="text-xs font-bold text-accent">Preliminary Screening</p>
        </div>
      </motion.div>

      {/* Main SVG Vector Container */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-white/95 to-blue-50/80 p-4 sm:p-6 border border-white/80 shadow-2xl shadow-blue-900/10 backdrop-blur-md">
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A9DE8" />
              <stop offset="100%" stopColor="#1E3A5F" />
            </linearGradient>
            <linearGradient id="softGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E1EEFC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#77B8F5" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A9DE8" stopOpacity="0" />
              <stop offset="50%" stopColor="#4A9DE8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4A9DE8" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background Grid Pattern */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E1EEFC" strokeWidth="1" />
          </pattern>
          <rect width="500" height="400" fill="url(#grid)" rx="16" />

          {/* Dashboard Container Graphic */}
          <rect x="30" y="30" width="440" height="340" rx="16" fill="white" fillOpacity="0.95" stroke="#E1EEFC" strokeWidth="2" />
          
          {/* Dashboard Header Bar */}
          <rect x="30" y="30" width="440" height="40" rx="16" fill="#F7FBFF" />
          <circle cx="55" cy="50" r="5" fill="#FF4D4F" />
          <circle cx="70" cy="50" r="5" fill="#F5B942" />
          <circle cx="85" cy="50" r="5" fill="#34C759" />
          <text x="105" y="54" fill="#1E3A5F" fontSize="11" fontWeight="700" fontFamily="sans-serif">DermaVision AI Dermatology Scanner</text>

          {/* Smartphone Scan Mockup (Left Side) */}
          <g transform="translate(55, 90)">
            <rect x="0" y="0" width="150" height="250" rx="22" fill="#1E3A5F" />
            <rect x="6" y="6" width="138" height="238" rx="17" fill="#F7FBFF" />
            {/* Phone Screen Notch */}
            <rect x="45" y="10" width="60" height="8" rx="4" fill="#1E3A5F" />
            
            {/* Skin Scan Area */}
            <rect x="14" y="28" width="122" height="145" rx="12" fill="url(#softGrad)" />
            {/* Scanning Grid Reticle */}
            <rect x="24" y="38" width="102" height="125" rx="8" fill="none" stroke="#4A9DE8" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="75" cy="100" r="30" fill="#77B8F5" fillOpacity="0.2" stroke="#4A9DE8" strokeWidth="2" />
            <path d="M 55 100 H 95 M 75 80 V 120" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round" />
            {/* Bounding Corners */}
            <path d="M 28 48 H 40 V 36 M 122 48 H 110 V 36 M 28 152 H 40 V 164 M 122 152 H 110 V 164" stroke="#4A9DE8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Scan Beam Line */}
            <rect x="18" y="85" width="114" height="24" fill="url(#scanGrad)" />

            {/* Phone Scan Action Button */}
            <rect x="20" y="185" width="110" height="32" rx="10" fill="#4A9DE8" />
            <text x="36" y="205" fill="white" fontSize="10" fontWeight="700" fontFamily="sans-serif">SCANNING SKIN...</text>
          </g>

          {/* AI Analysis Graphs & Dashboard Metrics (Right Side) */}
          <g transform="translate(230, 90)">
            {/* Metric Box 1 */}
            <rect x="0" y="0" width="215" height="70" rx="14" fill="#F7FBFF" stroke="#E1EEFC" strokeWidth="1.5" />
            <circle cx="28" cy="35" r="15" fill="#E1EEFC" />
            <path d="M 22 35 L 27 40 L 35 30" stroke="#4A9DE8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="54" y="30" fill="#1E3A5F" fontSize="12" fontWeight="700" fontFamily="sans-serif">Computer Vision AI</text>
            <text x="54" y="47" fill="#77B8F5" fontSize="10" fontWeight="600" fontFamily="sans-serif">Feature Extraction Active</text>
            <rect x="54" y="54" width="140" height="5" rx="2.5" fill="#E1EEFC" />
            <rect x="54" y="54" width="115" height="5" rx="2.5" fill="#4A9DE8" />

            {/* Metric Box 2 */}
            <rect x="0" y="85" width="215" height="70" rx="14" fill="#F7FBFF" stroke="#E1EEFC" strokeWidth="1.5" />
            <circle cx="28" cy="120" r="15" fill="#E1EEFC" />
            <path d="M 21 120 H 35 M 28 113 V 127" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
            <text x="54" y="115" fill="#1E3A5F" fontSize="12" fontWeight="700" fontFamily="sans-serif">Severity Score</text>
            <text x="54" y="132" fill="#34C759" fontSize="10" fontWeight="700" fontFamily="sans-serif">Analysis: Low Risk / Mild</text>
            <rect x="54" y="139" width="140" height="5" rx="2.5" fill="#E1EEFC" />
            <rect x="54" y="139" width="95" height="5" rx="2.5" fill="#34C759" />

            {/* AI Network Connector Lines */}
            <path d="M -25 60 C -10 60, -10 35, 0 35" stroke="#77B8F5" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M -25 125 C -10 125, -10 120, 0 120" stroke="#77B8F5" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* Bottom Performance Chart */}
          <g transform="translate(230, 260)">
            <rect x="0" y="0" width="215" height="80" rx="14" fill="#1E3A5F" />
            <text x="18" y="24" fill="#E1EEFC" fontSize="11" fontWeight="600" fontFamily="sans-serif">Detection Performance</text>
            <path d="M 18 60 Q 60 40, 100 50 T 200 30" stroke="#77B8F5" strokeWidth="3" fill="none" />
            <circle cx="200" cy="30" r="4.5" fill="#34C759" />
          </g>
        </svg>
      </div>
    </div>
  );
};

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const stats = [
    {
      number: '25',
      title: 'Supported Skin Diseases',
      desc: 'Comprehensive classification metrics covering major dermatological conditions.',
      icon: Search
    },
    {
      number: '86.77%',
      title: 'Average Detection Accuracy',
      desc: 'High-fidelity deep learning predictions trained on verified medical data.',
      icon: Award
    },
    {
      number: '<30 Seconds',
      title: 'Analysis Time',
      desc: 'Real-time feature extraction and severity grading in seconds.',
      icon: Zap
    },
    {
      number: '5000+',
      title: 'Training Images',
      desc: 'Curated dataset powering multi-layered neural network algorithms.',
      icon: Database
    }
  ];

  const pillarCards = [
    {
      title: 'Our Objective',
      icon: Target,
      content: 'Provide accessible AI-powered preliminary skin screening that encourages early detection and timely medical consultation.',
      badgeBg: 'bg-gradient-to-br from-blue-50 to-blue-100/80 text-primary border-blue-100'
    },
    {
      title: 'Problem Statement',
      icon: AlertTriangle,
      content: 'Many patients delay dermatologist visits due to long waiting periods or limited accessibility, allowing treatable skin diseases to worsen.',
      badgeBg: 'bg-gradient-to-br from-amber-50 to-red-50 text-amber-600 border-amber-100'
    },
    {
      title: 'Our Solution',
      icon: Lightbulb,
      content: 'DermaVision combines computer vision and deep learning to analyze skin images, estimate disease severity, and generate comprehensive screening reports within seconds.',
      badgeBg: 'bg-gradient-to-br from-sky-50 to-blue-100 text-secondary border-blue-100'
    }
  ];

  const featureCards = [
    {
      title: 'AI-Powered Disease Detection',
      desc: 'Uses convolutional neural networks trained on clinical datasets.',
      icon: Cpu
    },
    {
      title: 'Severity Analysis',
      desc: 'Evaluates lesion boundaries, density, and local spread factors.',
      icon: Activity
    },
    {
      title: 'Confidence Score',
      desc: 'Displays probability confidence metrics for preliminary awareness.',
      icon: CheckCircle2
    },
    {
      title: 'Secure Image Upload',
      desc: 'End-to-end encrypted upload pipeline with automatic cleanup.',
      icon: Lock
    },
    {
      title: 'Instant PDF Report',
      desc: 'Generates downloadable summary reports for physician review.',
      icon: FileText
    },
    {
      title: 'Privacy Focused',
      desc: 'Images are analyzed in-memory and never stored on server disks.',
      icon: Shield
    },
    {
      title: 'Fast Analysis',
      desc: 'Receive preliminary analysis and metrics in under 30 seconds.',
      icon: Zap
    },
    {
      title: 'User-Friendly Interface',
      desc: 'Intuitive, clean design accessible on mobile, tablet, or desktop.',
      icon: Smartphone
    }
  ];

  const faqs = [
    {
      q: 'How accurate is DermaVision?',
      a: 'DermaVision achieves up to 86.77% average detection accuracy across supported skin conditions, utilizing advanced deep learning convolutional models trained on verified dermatological dataset repositories.'
    },
    {
      q: 'Does DermaVision store my uploaded images?',
      a: 'Yes. Uploaded skin images and their corresponding AI screening reports are securely stored in your personal account to provide access to your screening history. All data is protected and accessible only to you.'
    },
    {
      q: 'Is this a medical diagnosis?',
      a: 'No. DermaVision provides AI-assisted preliminary screening only to help users detect potential anomalies early and seek timely medical consultation. It does not replace a clinical diagnosis from a licensed dermatologist.'
    },
    {
      q: 'What skin conditions are supported?',
      a: 'DermaVision currently supports 25 skin conditions, including Warts (Verrucae), Vitiligo, Tinea (Ringworm), Scabies, Acne, Eczema, Psoriasis, and other common dermatological concerns.'
    },
    {
      q: 'Can I download my screening report?',
      a: 'Yes! After completing your scan, you can generate and download a comprehensive instant PDF summary report containing classification results, severity ratings, and clinical notes to share with your healthcare provider.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full overflow-hidden"
    >
      {/* Background Blobs matching Homepage */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#E1EEFC] floating-blob -z-20"></div>
      <div className="absolute top-[45rem] right-10 w-80 h-80 rounded-full bg-blue-200 floating-blob -z-20 animation-delay-2000"></div>

      {/* --------------------------------------------------
          1. HERO SECTION
         -------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-100/50 text-[#1E3A5F] text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>AI Dermatology Innovation</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-accent tracking-tight leading-tight"
          >
            About <span className="text-gradient font-black">DermaVision</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-primary font-semibold text-lg sm:text-xl leading-snug"
          >
            Bridging Artificial Intelligence and Dermatology for Early Skin Disease Screening.
          </motion.p>

          <motion.p 
            variants={itemVariants}
            className="text-slate-500 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            DermaVision uses AI and computer vision to provide fast, secure, and preliminary skin disease screening while encouraging professional medical consultation. By evaluating image textures and structural traits in seconds, we make preliminary dermatological screening accessible to everyone.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link 
              to="/screen" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-blue-500/10 btn-glow transition-all"
            >
              <span>Start Free Screening</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a 
              href="#statistics" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-accent font-semibold px-8 py-4 rounded-full border border-slate-200 shadow-sm transition-all"
            >
              Learn More
            </a>
          </motion.div>
        </div>

        {/* Hero Right Column: Vector AI Healthcare Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div 
            variants={itemVariants}
            className="w-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <AIHealthcareIllustration />
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------
          2. PROJECT STATISTICS
         -------------------------------------------------- */}
      <section id="statistics" className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card rounded-custom p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-accent tracking-tight">
                    {stat.number}
                  </span>
                  <div className="p-2.5 bg-blue-50 rounded-xl text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-accent mb-1.5">{stat.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{stat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------
          3. OBJECTIVE / PROBLEM / SOLUTION
         -------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-serif text-accent font-black">Our Core Pillars</h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Understanding the purpose, problem domain, and technology driving DermaVision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillarCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="glass-card rounded-custom p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3.5 rounded-2xl border ${card.badgeBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-accent">{card.title}</h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed pt-2">
                    {card.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------
          4. WHY CHOOSE DERMAVISION
         -------------------------------------------------- */}
      <section className="bg-white/60 py-20 border-y border-slate-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-serif text-accent font-black">Why Choose DermaVision</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Designed with state-of-the-art computer vision engineering, privacy safeguards, and user-centric features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-custom p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-blue-50 rounded-xl text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-serif text-accent pt-1">{feat.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          5. MEDICAL DISCLAIMER
         -------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-6 py-12 lg:px-8">
        <motion.div 
          variants={itemVariants}
          className="bg-amber-50/90 border border-amber-200/90 rounded-custom p-8 shadow-sm flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5"
        >
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-amber-900">Medical Disclaimer</h3>
            <p className="text-amber-800 text-sm leading-relaxed font-medium">
              DermaVision provides AI-assisted preliminary screening only. It is not intended to replace diagnosis, treatment, or advice from a qualified dermatologist. Always consult a healthcare professional for medical concerns.
            </p>
          </div>
        </motion.div>
      </section>

      {/* --------------------------------------------------
          6. FAQ SECTION
         -------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-6 py-16 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-serif text-accent font-black">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Find answers to common questions regarding DermaVision screening and security.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="glass-card rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base font-bold font-serif text-accent">{faq.q}</span>
                  <div className={`p-1.5 rounded-full bg-blue-50 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-1 text-slate-500 text-sm leading-relaxed border-t border-slate-100/80">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------
          7. CALL TO ACTION
         -------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#1E3A5F] to-[#4A9DE8] px-8 py-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Accent decoration rings */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-4 border-white/5"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border-4 border-white/5"></div>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">
              Ready to Analyze Your Skin?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Upload a skin image and receive an AI-powered preliminary screening report in less than 30 seconds.
            </p>
            <div className="pt-4 flex justify-center">
              <Link 
                to="/screen"
                className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-accent font-semibold px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 duration-150"
              >
                <span>Start Free Screening</span>
                <ArrowRight className="w-5 h-5 ml-2 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

export default About;
