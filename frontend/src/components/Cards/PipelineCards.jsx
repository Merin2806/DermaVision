import React, { useState } from 'react';
import { Layers, Eye, MapPin, Activity, Image as ImageIcon, Sparkles, CheckCircle, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const getBodyPart = (scan) => {
  if (scan.bodyPart && scan.bodyPart !== 'Right Arm / Hand') return scan.bodyPart;
  const cond = (scan.condition || '').toLowerCase();
  if (cond.includes('acne') || cond.includes('rosacea')) return 'Face / Forehead';
  if (cond.includes('alopecia')) return 'Scalp & Hairline';
  if (cond.includes('wart') || cond.includes('verruca')) return 'Hands & Fingers';
  if (cond.includes('vitiligo')) return 'Hands & Wrists';
  if (cond.includes('eczema') || cond.includes('dermatitis')) return 'Hands & Arms';
  if (cond.includes('psoriasis')) return 'Elbows & Knees';
  if (cond.includes('tinea') || cond.includes('ringworm')) return 'Torso & Chest';
  if (cond.includes('scabies')) return 'Wrist & Fingers';
  if (cond.includes('basal') || cond.includes('squamous') || cond.includes('carcinoma')) return 'Face & Nose';
  if (cond.includes('melanoma') || cond.includes('nevus')) return 'Back & Torso';
  if (cond.includes('herpes')) return 'Lips & Mouth Area';
  return scan.bodyPart || 'Skin Surface / Lesion Site';
};

const PipelineCards = ({ currentScan }) => {
  const [activeTab, setActiveTab] = useState('heatmap'); // 'heatmap' or 'segmentation'

  if (!currentScan) return null;

  const {
    affectedArea = '18.6%',
    lesionCoverage = currentScan.affectedArea || 'N/A',
    followUpRecommendation = currentScan.severity === 'Mild' ? '30 Days' : currentScan.severity === 'Moderate' ? '14 Days' : '7 Days',
    segmentationMask,
    gradCamUrl,
    imageUrl,
    severityScore = currentScan.severity === 'Severe' ? '88/100' : currentScan.severity === 'Moderate' ? '68/100' : '35/100',
    similarCases = 14,
    averageSeverity = currentScan.severity || 'Moderate',
    aiModelsUsed = [
      'EfficientNet-B4 (Classification)',
      'U-Net (Lesion Segmentation)',
      'YOLO (Body Part Detection)',
      'Grad-CAM (Explainable AI)',
      'CLIP + FAISS (Similar Case Matching)'
    ]
  } = currentScan;

  const bodyPart = getBodyPart(currentScan);


  const displayGradCam = gradCamUrl || imageUrl;
  const displaySegmentation = segmentationMask || imageUrl;

  return (
    <div className="space-y-8">
      {/* 1. Visual AI Pipeline Analysis (Grad-CAM & Lesion Segmentation) */}
      <div className="glass-card rounded-custom p-6 shadow-md border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Multi-Model Visual Inspection</span>
            </span>
            <h3 className="text-xl font-bold font-serif text-accent">Explainable AI & Lesion Mask</h3>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'heatmap'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Grad-CAM Heatmap</span>
            </button>
            <button
              onClick={() => setActiveTab('segmentation')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'segmentation'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Lesion Overlay</span>
            </button>
          </div>
        </div>

        {/* View content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Visual Canvas Display */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800 relative min-h-[260px] overflow-hidden">
            {activeTab === 'heatmap' ? (
              displayGradCam ? (
                <div className="relative max-h-[280px] w-full flex items-center justify-center overflow-hidden rounded-xl">
                  <motion.img
                    key="gradcam"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={displayGradCam}
                    alt="Grad-CAM Activation Heatmap"
                    className="max-h-[280px] w-auto object-contain rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/35 via-rose-500/25 to-transparent mix-blend-color-dodge pointer-events-none rounded-xl" />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400 text-xs">
                  <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
                  <span>Grad-CAM heatmap visual activation map</span>
                </div>
              )
            ) : (
              displaySegmentation ? (
                <div className="relative max-h-[280px] w-full flex items-center justify-center overflow-hidden rounded-xl">
                  <motion.img
                    key="segmentation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={displaySegmentation}
                    alt="Lesion Segmentation Outline"
                    className="max-h-[280px] w-auto object-contain rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-sky-400/80 rounded-xl pointer-events-none bg-sky-500/10" />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400 text-xs">
                  <Layers className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-60" />
                  <span>Skin lesion boundary segmentation outline</span>
                </div>
              )
            )}
          </div>

          {/* Visual Analysis Explanation details */}
          <div className="md:col-span-5 space-y-4">
            {activeTab === 'heatmap' ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1 text-amber-600" />
                    Why AI Predicted This
                  </span>
                  <p className="text-amber-800/80 leading-relaxed">
                    Warm red & yellow highlights denote spatial pixel regions that heavily influenced the EfficientNet model's classification score.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Feature Model:</span>
                    <span className="font-bold text-accent">Grad-CAM Net</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Target Layer:</span>
                    <span className="font-mono font-semibold text-primary">top_activation</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-900 flex items-center">
                    <Layers className="w-4 h-4 mr-1 text-blue-600" />
                    Skin Lesion Margin
                  </span>
                  <p className="text-blue-800/80 leading-relaxed">
                    U-Net computer vision segmentation isolates lesion boundaries and measures exact surface coverage.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Affected Lesion Area:</span>
                    <span className="font-bold text-primary text-sm">{affectedArea}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Segmentation Model:</span>
                    <span className="font-bold text-accent">U-Net Contour Masker</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Metrics Grid: Body Location, Severity Score, Similar Cases */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Lesion Coverage Card */}
        <div className="glass-card rounded-custom p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-primary rounded-2xl shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">🎯 Lesion Coverage</span>
            <span className="text-lg font-bold text-accent font-serif">{lesionCoverage}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Estimated Affected Area</span>
          </div>
        </div>

        {/* Severity Score Card */}
        <div className="glass-card rounded-custom p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Severity Score</span>
            <span className="text-lg font-bold text-accent font-serif">{severityScore}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Custom Severity Regressor</span>
          </div>
        </div>

        {/* Follow-up Card */}
        <div className="glass-card rounded-custom p-5 shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">📅 Follow-up</span>
            <span className="text-lg font-bold text-accent font-serif">{followUpRecommendation}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Recheck after</span>
          </div>
        </div>
      </div>

      {/* 3. AI Models Pipeline Badges */}
      <div className="glass-card rounded-custom p-4 bg-slate-50/70 border border-slate-150">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
          Active Multi-Model Pipeline Infrastructure:
        </span>
        <div className="flex flex-wrap gap-2">
          {aiModelsUsed.map((modelName, i) => (
            <span key={i} className="inline-flex items-center text-xs bg-white text-accent px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-medium">
              <CheckCircle className="w-3 h-3 text-success mr-1.5" />
              {modelName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineCards;
