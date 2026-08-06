import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ChevronRight, FileText, Image as ImageIcon,
  AlertTriangle, Stethoscope, FileDown, Loader2, CheckCheck
} from 'lucide-react';
import ConditionCard from '../../components/Cards/ConditionCard';
import SeverityCard from '../../components/Cards/SeverityCard';
import DisclaimerCard from '../../components/Cards/DisclaimerCard';
import PipelineCards from '../../components/Cards/PipelineCards';
import ConfidenceCard from '../../components/Cards/ConfidenceCard';
import PatientDetailsModal from '../../components/Modals/PatientDetailsModal';
import ReportPreviewModal from '../../components/Modals/ReportPreviewModal';
import api from '../../services/api';

// ── Toast Notification Component ─────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold
          ${type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
          }`}
      >
        {type === 'success' ? (
          <CheckCheck className="w-4 h-4 shrink-0" />
        ) : (
          <AlertTriangle className="w-4 h-4 shrink-0" />
        )}
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Main Result Component ─────────────────────────────────────────────────────
const Result = ({ currentScan, onReset }) => {
  const navigate = useNavigate();

  // ── Report generation state ──────────────────────────────────────────────
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null); // { filename, downloadUrl }
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    if (!currentScan) {
      navigate('/screen');
    }
  }, [currentScan, navigate]);

  if (!currentScan) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 4000);
  };

  const handleRetake = () => {
    onReset();
    navigate('/screen');
  };

  // When user submits patient details → call backend
  const handlePatientSubmit = async (patientData) => {
    setShowPatientModal(false);
    setIsGenerating(true);
    try {
      const payload = {
        patient: patientData,
        prediction: {
          condition: currentScan.condition,
          confidence: currentScan.confidence,
          severity: currentScan.severity,
          severityScore: currentScan.severityScore,
          affectedArea: currentScan.affectedArea,
          bodyPart: currentScan.bodyPart,
        },
        imageUrl: currentScan.imageUrl || null,
        recommendations: currentScan.recommendations || [],
        description: currentScan.description || '',
        symptoms: currentScan.symptoms || [],
        possibleCauses: currentScan.possibleCauses || [],
        homeCare: currentScan.homeCare || [],
        consultDoctor: currentScan.consultDoctor || [],
        aiModelsUsed: currentScan.aiModelsUsed || [],
      };

      const response = await api.post('/report/generate', payload);
      setGeneratedReport(response.data);
      showToast('Report generated successfully!', 'success');
    } catch (err) {
      console.error('Report generation failed:', err);
      showToast('Failed to generate report. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger PDF download directly
  const handleDownloadPdf = () => {
    if (!generatedReport) return;
    const link = document.createElement('a');
    link.href = `http://localhost:5001${generatedReport.downloadUrl}`;
    link.download = generatedReport.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultConsultationReasons = [
    'Rapidly spreading lesions or sudden changes in color, size, or shape.',
    'Severe itching, pain, bleeding, or fluid discharge from affected skin areas.',
    'Lack of improvement after several weeks of standard care.',
    'Lesions accompanied by fever, persistent discomfort, or systemic symptoms.',
  ];

  const consultDoctorList =
    currentScan.consultDoctor && currentScan.consultDoctor.length > 0
      ? currentScan.consultDoctor
      : defaultConsultationReasons;

  return (
    <>
      {/* ── Toast Notification ── */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      {/* ── Patient Details Modal ── */}
      <PatientDetailsModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSubmit={handlePatientSubmit}
      />

      {/* ── Report Preview Modal ── */}
      {generatedReport && (
        <ReportPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          pdfUrl={generatedReport.downloadUrl}
          filename={generatedReport.filename}
        />
      )}

      {/* ── Full-screen Generating Overlay ── */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center space-y-4"
          >
            <div className="bg-white/95 rounded-[24px] p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-xs w-full mx-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <FileDown className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-accent font-bold font-serif text-lg">Generating Report</p>
                <p className="text-slate-500 text-xs mt-1">Building your professional diagnostic PDF...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="max-w-6xl mx-auto px-6 py-12 lg:px-8 space-y-8"
      >
        {/* ─────────────────────────────────────────────────────────────────────
            1. HEADER
           ───────────────────────────────────────────────────────────────────── */}
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
            <h1 className="text-4xl font-serif text-accent font-black tracking-tight">
              AI Screening Report
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Scan completed on {new Date(currentScan.date).toLocaleDateString()} at{' '}
              {new Date(currentScan.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            2. SUMMARY SECTION
           ───────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-6">
            <ConditionCard condition={currentScan.condition} />
            <ConfidenceCard confidence={currentScan.confidence} />
          </div>

          {/* Right Column */}
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

            {/* Severity Card */}
            <SeverityCard severity={currentScan.severity} />

            {/* Action Buttons */}
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

            {/* ── Generate Report Section ───────────────────────────────────── */}
            <div className="bg-gradient-to-br from-blue-50/80 to-slate-50/60 border border-blue-100 rounded-[20px] p-5 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-bold text-accent text-sm">Professional Diagnostic Report</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate a hospital-style PDF diagnostic report including patient details, disease
                overview, AI confidence charts, and recommended next steps.
              </p>

              {/* Before generation: single button */}
              {!generatedReport && (
                <button
                  onClick={() => setShowPatientModal(true)}
                  disabled={isGenerating}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3.5 rounded-full shadow-md transition-all cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>
              )}

              {/* After generation: preview + download */}
              {generatedReport && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 border-2 border-primary text-primary font-bold px-5 py-3 rounded-full hover:bg-blue-50 transition-colors text-sm cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Preview Report</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-primary hover:bg-primary/95 text-white font-bold px-5 py-3 rounded-full shadow-md btn-glow transition-all text-sm cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              )}

              {/* Regenerate link after first generation */}
              {generatedReport && (
                <button
                  onClick={() => {
                    setGeneratedReport(null);
                    setShowPatientModal(true);
                  }}
                  className="w-full text-xs text-slate-400 hover:text-primary underline-offset-2 hover:underline transition-colors cursor-pointer"
                >
                  Generate a new report with different patient details
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            3. CLINICAL PROFILE
           ───────────────────────────────────────────────────────────────────── */}
        {currentScan.description && (
          <div className="glass-card rounded-custom p-8 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xl font-bold text-accent font-serif flex items-center">
              <Stethoscope className="w-6 h-6 mr-2 text-primary" />
              Clinical Profile &amp; Overview
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">{currentScan.description}</p>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────
            4. AI ANALYSIS PIPELINE
           ───────────────────────────────────────────────────────────────────── */}
        <PipelineCards currentScan={currentScan} />

        {/* ─────────────────────────────────────────────────────────────────────
            5. RECOMMENDATIONS
           ───────────────────────────────────────────────────────────────────── */}
        <div className="glass-card rounded-custom p-8 shadow-md border border-slate-100 space-y-6">
          <h3 className="text-xl font-bold text-accent font-serif flex items-center">
            <FileText className="w-6 h-6 mr-2.5 text-primary" />
            <span>Evidence-Guided Precautions &amp; Home Care</span>
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

        {/* ─────────────────────────────────────────────────────────────────────
            6. WHEN TO CONSULT
           ───────────────────────────────────────────────────────────────────── */}
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
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────
            7. DISCLAIMER
           ───────────────────────────────────────────────────────────────────── */}
        <DisclaimerCard />
      </motion.div>
    </>
  );
};

export default Result;
