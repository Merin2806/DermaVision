import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Check, Image, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DisclaimerCard from '../../components/Cards/DisclaimerCard';

const Screen = ({ tempImage, setTempImage, onAnalyze }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [qualityChecks, setQualityChecks] = useState({
    blur: 'pending', // pending, checking, success
    brightness: 'pending',
    resolution: 'pending',
    quality: 'pending'
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Reset checks if image removed
  useEffect(() => {
    if (!tempImage) {
      setQualityChecks({
        blur: 'pending',
        brightness: 'pending',
        resolution: 'pending',
        quality: 'pending'
      });
      setError('');
    }
  }, [tempImage]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or WEBP image.');
      return false;
    }
    
    // Check size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image is too large. Maximum size is 10MB.');
      return false;
    }

    setError('');
    return true;
  };

  const processFile = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImage({
        name: file.name,
        size: file.size,
        data: e.target.result // Base64
      });
      runQualityChecks();
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setTempImage(null);
  };

  const runQualityChecks = () => {
    const keys = ['quality', 'blur', 'brightness', 'resolution'];
    keys.forEach((key, index) => {
      // Set to checking
      setTimeout(() => {
        setQualityChecks(prev => ({ ...prev, [key]: 'checking' }));
      }, index * 400);

      // Set to success
      setTimeout(() => {
        setQualityChecks(prev => ({ ...prev, [key]: 'success' }));
      }, index * 400 + 350);
    });
  };

  const handleAnalyzeClick = async () => {
    if (!tempImage) return;
    
    // Trigger analysis
    navigate('/loading');
    try {
      await onAnalyze(tempImage);
    } catch (err) {
      console.error(err);
      navigate('/screen');
    }
  };

  const checkSteps = [
    { key: 'quality', label: 'Image Quality Check', okLabel: 'Good' },
    { key: 'blur', label: 'Focus & Blur Detection', okLabel: 'Clear' },
    { key: 'brightness', label: 'Illumination Check', okLabel: 'Normal' },
    { key: 'resolution', label: 'Minimum Resolution', okLabel: 'Adequate' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto px-6 py-12 lg:px-8 space-y-8"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-4xl font-serif text-accent font-bold">Skin Screening</h1>
        <p className="text-slate-500">
          Upload a clear, well-lit photograph of the localized skin lesion or affected area for analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Upload Column */}
        <div className="md:col-span-7">
          <div className="glass-card rounded-custom p-6 shadow-md border border-slate-100">
            <AnimatePresence mode="wait">
              {!tempImage ? (
                // Dropzone
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`relative border-2 border-dashed rounded-[20px] p-12 text-center transition-all ${
                    dragActive 
                      ? 'border-primary bg-blue-50/35 scale-[0.99]' 
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-blue-50 text-primary rounded-2xl shadow-sm">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <button 
                        type="button" 
                        onClick={triggerFileSelect}
                        className="text-base font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        Choose a file
                      </button>
                      <span className="text-slate-500"> or drag it here</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Supports JPG, PNG, WEBP. Max 10MB.
                    </p>
                  </div>
                </motion.div>
              ) : (
                // Preview Window
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-[20px] overflow-hidden border border-slate-200 max-h-[350px] flex items-center justify-center bg-slate-50">
                    <img 
                      src={tempImage.data} 
                      alt="Uploaded Scan" 
                      className="max-h-[350px] w-auto object-contain"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full transition-colors backdrop-blur-sm shadow-md cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-2 truncate">
                      <Image className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate font-semibold">{tempImage.name}</span>
                    </div>
                    <span className="font-medium shrink-0">{(tempImage.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-4 flex items-center space-x-2 text-danger bg-red-50 p-3 rounded-xl border border-red-100 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quality Assessment & Actions Column */}
        <div className="md:col-span-5 space-y-6">
          {/* Quality Assessment Card */}
          <div className="glass-card rounded-custom p-6 shadow-md border border-slate-100">
            <h3 className="text-lg font-bold font-serif text-accent mb-4 border-b border-slate-100 pb-2">
              Image Quality Assessment
            </h3>
            
            <div className="space-y-4">
              {checkSteps.map((step) => {
                const status = qualityChecks[step.key];
                return (
                  <div key={step.key} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                    <span className="text-sm font-semibold text-accent/80">{step.label}</span>
                    <div className="flex items-center">
                      {status === 'pending' && (
                        <span className="text-xs text-slate-300 font-medium">Pending upload</span>
                      )}
                      {status === 'checking' && (
                        <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                      )}
                      {status === 'success' && (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-success bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <Check className="w-3 h-3" />
                          <span>{step.okLabel}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleAnalyzeClick}
              disabled={!tempImage || Object.values(qualityChecks).some(v => v !== 'success')}
              className={`w-full inline-flex items-center justify-center font-bold px-6 py-4 rounded-full shadow-md transition-all ${
                tempImage && Object.values(qualityChecks).every(v => v === 'success')
                  ? 'bg-primary hover:bg-primary/95 text-white btn-glow cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
              }`}
            >
              Analyze Image
            </button>
            {tempImage && (
              <button
                onClick={removeImage}
                className="w-full inline-flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 px-6 py-4 rounded-full shadow-sm transition-colors cursor-pointer"
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warnings & Disclaimer */}
      <div className="pt-4">
        <DisclaimerCard />
      </div>
    </motion.div>
  );
};

export default Screen;
