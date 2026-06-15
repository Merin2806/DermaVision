import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Zap, Activity, Award, CheckCircle2, 
  Upload, Search, Cpu, Sparkles, ClipboardList 
} from 'lucide-react';
import heroImg from '../../assets/hero.png';

const Home = () => {
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

  const featurePills = [
    { text: 'Disease Detection', icon: Search },
    { text: 'Severity Score', icon: Activity },
    { text: 'Screening Report', icon: ClipboardList },
    { text: 'Instant Results', icon: Zap },
    { text: 'Private & Secure', icon: ShieldCheck }
  ];

  const steps = [
    { num: '01', title: 'Upload Image', desc: 'Securely upload a photo of the affected skin area.', icon: Upload },
    { num: '02', title: 'Quality Check', desc: 'Auto-checks blur, illumination, and focus criteria.', icon: CheckCircle2 },
    { num: '03', title: 'Preprocessing', desc: 'Sizes and crops the region of interest for analysis.', icon: Search },
    { num: '04', title: 'AI Detection', desc: 'Identifies specific pathological classification metrics.', icon: Cpu },
    { num: '05', title: 'Severity Analysis', desc: 'Calculates structural spread and severity grading.', icon: Activity },
    { num: '06', title: 'Report Generation', desc: 'Generates detailed recommendations and statistics.', icon: ClipboardList }
  ];

  const conditions = [
    { 
      name: 'Acne Vulgaris', 
      desc: 'Characterized by blackheads, whiteheads, pimples, and deeper cysts, commonly developing on the face, neck, and back.',
      stat: '96.4% Model Accuracy'
    },
    { 
      name: 'Eczema / Dermatitis', 
      desc: 'An inflammatory condition triggering dry, itchy, red skin patches, frequently exacerbated by environmental allergens.',
      stat: '94.2% Model Accuracy'
    },
    { 
      name: 'Psoriasis', 
      desc: 'An autoimmune condition causing rapid buildup of skin cells, creating scaly plaques that can itch or sting.',
      stat: '93.5% Model Accuracy'
    },
    { 
      name: 'Fungal Infections (Tinea)', 
      desc: 'Superficial skin infections caused by fungi (e.g. ringworm, athlete\'s foot) presenting as circular scaling plaques.',
      stat: '95.1% Model Accuracy'
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full overflow-hidden"
    >
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#E1EEFC] floating-blob -z-20"></div>
      <div className="absolute top-[40rem] right-10 w-80 h-80 rounded-full bg-blue-200 floating-blob -z-20 animation-delay-2000"></div>
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center space-x-1.5 bg-blue-50/80 px-4 py-1.5 rounded-full border border-blue-100/40 text-[#1E3A5F] text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>🩺 AI-Powered Skin Screening</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-accent tracking-tight leading-tight"
          >
            Understand Your Skin <br />
            With <span className="text-gradient font-black">AI Precision</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-slate-500 text-lg sm:text-xl max-w-2xl leading-relaxed"
          >
            DermaVision provides preliminary AI-powered screening for common skin conditions including acne, eczema, psoriasis and fungal infections. Fast, confidential, and evidence-guided.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link 
              to="/screen" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-blue-500/10 btn-glow transition-all"
            >
              <span>Upload Skin Image</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              to="/about" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-slate-50 text-accent font-semibold px-8 py-4 rounded-full border border-slate-200 shadow-sm transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Hero Image / Mock UI */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div 
            variants={itemVariants}
            className="relative w-full max-w-md"
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[24px] blur-xl -z-10"></div>
            <img 
              src={heroImg} 
              alt="Skin Screening UI Illustration" 
              className="w-full h-auto object-cover rounded-[24px] shadow-2xl shadow-blue-900/10 border border-white/60 bg-white p-2"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Feature Pills */}
      <section className="bg-white/40 py-8 border-y border-blue-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {featurePills.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-full shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-1 bg-blue-50 rounded-full text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-accent/80">{pill.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How It Works Timeline */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-serif text-accent font-black">How It Works</h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Our multi-stage pipeline is engineered to assess quality, filter noise, and evaluate deep convolutional traits in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="group glass-card rounded-custom p-6 relative hover:shadow-xl transition-all duration-300 border border-slate-150/50 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-3xl font-black text-blue-100 group-hover:text-primary/10 transition-colors duration-300">
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-accent mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Conditions Section */}
      <section className="bg-white/60 py-24 border-y border-slate-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-serif text-accent font-black">Supported Conditions</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              DermaVision matches skin traits against classification metrics trained on clinically verified dermatological repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {conditions.map((c, idx) => (
              <div 
                key={idx} 
                className="group glass-card rounded-custom p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold font-serif text-accent">{c.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {c.stat}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer group-hover:translate-x-1.5 duration-200">
                  <span>View clinical literature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Block */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#1E3A5F] to-[#4A9DE8] px-8 py-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Accent decoration rings */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-4 border-white/5"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border-4 border-white/5"></div>

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight">
              Ready to get screened?
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

export default Home;
