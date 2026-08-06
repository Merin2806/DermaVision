import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, ExternalLink } from 'lucide-react';

const ReportPreviewModal = ({ isOpen, onClose, pdfUrl, filename }) => {
  if (!isOpen) return null;

  // Build the full backend URL for the PDF
  const backendBaseUrl = 'http://localhost:5001';
  const fullPdfUrl = `${backendBaseUrl}${pdfUrl}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fullPdfUrl;
    link.download = filename || 'DermaVision_Report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl h-[85vh] bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-[24px] p-6 shadow-2xl flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-primary rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-accent">Screening Report Preview</h3>
              <p className="text-xs text-slate-500 mt-0.5">{filename || 'DermaVision_Report.pdf'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <a
              href={fullPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="flex-grow rounded-[16px] overflow-hidden border border-slate-200 bg-slate-100 shadow-inner relative">
          <iframe
            src={`${fullPdfUrl}#toolbar=0`}
            title="PDF Report Preview"
            className="w-full h-full border-0"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ReportPreviewModal;
