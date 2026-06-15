import React from 'react';
import { ShieldAlert } from 'lucide-react';

const DisclaimerCard = () => {
  return (
    <div className="bg-[#FFF8E6] border border-[#FFE7A5] rounded-custom p-6 flex items-start space-x-4 shadow-sm">
      <div className="p-2 bg-[#FFF1C5] rounded-xl text-warning">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-[#8F6A10] font-semibold text-base mb-1 font-sans">
          Important Medical Disclaimer
        </h4>
        <p className="text-[#9A7D33] text-sm leading-relaxed">
          DermaVision is an AI-powered screening tool designed for preliminary evaluation and educational purposes. It does not provide medical diagnoses, treatment plans, or professional advice. Always seek the advice of a qualified dermatologist or other healthcare providers regarding any skin condition or medical question. Never disregard professional advice because of information read here.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerCard;
