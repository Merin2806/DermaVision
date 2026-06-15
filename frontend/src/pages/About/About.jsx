import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Heart, Award, Users, BookOpen, Layers } from 'lucide-react';

const About = () => {
  const timelineSteps = [
    { num: '1', title: 'Image Upload', desc: 'Secure ingestion of lesion photography through web endpoints.' },
    { num: '2', title: 'Quality Assessment', desc: 'Automated brightness calibration, blur thresholds, and cropping validation.' },
    { num: '3', title: 'Preprocessing', desc: 'Color space standardizations and local contrast adaptations using OpenCV.' },
    { num: '4', title: 'AI Classification', desc: 'Consequences generated from convolutional weight architectures (MobileNetV2).' },
    { num: '5', title: 'Severity Analysis', desc: 'Evaluation of structural boundaries, density, and local spread factors.' },
    { num: '6', title: 'Report Delivery', desc: 'Structured documentation rendering with customized evidence suggestions.' }
  ];

  const technologies = [
    'React', 'Python', 'TensorFlow', 'Keras', 'OpenCV', 
    'MobileNetV2', 'EfficientNetB0', 'Transfer Learning', 
    'REST API', 'Kaggle Datasets', 'DermNet'
  ];

  const team = [
    {
      name: 'Dr. Elizabeth Vance',
      role: 'Chief Medical Officer',
      bio: 'Board-certified clinical dermatologist with 12+ years of academic research in lesion screening.',
      initials: 'EV',
      color: 'bg-blue-100 text-primary'
    },
    {
      name: 'Dr. Marcus Chen',
      role: 'Lead AI Scientist',
      bio: 'PhD in Computer Vision. Former deep learning researcher at Stanford AI Lab.',
      initials: 'MC',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Head of Engineering',
      bio: 'Experienced full stack developer focusing on responsive design systems and healthtech integrations.',
      initials: 'SJ',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-6xl mx-auto px-6 py-12 lg:px-8 space-y-16"
    >
      {/* 1. Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif text-accent font-black tracking-tight">
          About DermaVision
        </h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Bridging the gap between computer vision technology and early clinical evaluation parameters.
        </p>
      </div>

      {/* 2. Objective vs Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-custom p-8 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 rounded-xl text-primary">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-serif text-accent">Our Objective</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            DermaVision aims to build highly accessible, pre-diagnostic tools that empower individuals to check skin anomalies early. By combining robust neural frameworks with modern web delivery, we aim to encourage early clinical consultations and promote overall skin health awareness.
          </p>
        </div>

        <div className="glass-card rounded-custom p-8 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-red-50 rounded-xl text-danger">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-serif text-accent">The Problem Statement</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Skin conditions represent a significant global disease burden, yet dermatologist wait times can extend to months. Early screening is critical, yet individuals often delay professional evaluation, letting treatable cases progress. DermaVision bridges this gap with instant evidence-based screening.
          </p>
        </div>
      </div>

      {/* 3. Timeline Workflow */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif text-accent font-bold">Clinical Analysis Pipeline</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Under the Hood</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelineSteps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-custom p-6 border border-slate-150 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-bold text-sm">
                  {step.num}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Stage 0{step.num}</span>
              </div>
              <div>
                <h4 className="text-base font-bold font-serif text-accent mb-1.5">{step.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tech Stack */}
      <div className="glass-card rounded-custom p-8 shadow-md border border-slate-100 text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold font-serif text-accent">Engineered Technology Stack</h3>
        </div>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
          The software suite is backed by modern React modularity on the frontend client and state-of-the-art Deep Learning modules.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto pt-2">
          {technologies.map((tech, idx) => (
            <span 
              key={idx}
              className="text-xs font-semibold bg-blue-50/70 border border-blue-100/50 text-accent/80 px-3.5 py-1.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 5. Team Cards */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-serif text-accent font-bold">Clinical & AI Advisory</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Meet the founders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-custom p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4"
            >
              {/* Initials Avatar */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border border-white ${member.color}`}>
                {member.initials}
              </div>
              <div>
                <h4 className="text-lg font-bold font-serif text-accent">{member.name}</h4>
                <p className="text-xs text-primary font-semibold tracking-wide uppercase mt-0.5">{member.role}</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default About;
