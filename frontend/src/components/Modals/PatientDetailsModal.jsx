import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Users, FileSpreadsheet } from 'lucide-react';

const PatientDetailsModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    patientId: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Patient Name is required';
    }
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 125) {
        newErrors.age = 'Please enter a valid age (0-125)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-[24px] p-6 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold font-serif text-accent">Patient Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">Please provide patient details for the diagnostic report.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-accent/80 uppercase tracking-wider flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Patient Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                errors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-accent/80 uppercase tracking-wider flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                min="0"
                max="120"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                  errors.age ? 'border-red-400 focus:ring-red-100' : 'border-slate-200'
                }`}
              />
              {errors.age && <p className="text-xs text-red-500 font-semibold">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-accent/80 uppercase tracking-wider flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Patient ID (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-accent/80 uppercase tracking-wider flex items-center">
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Patient ID (Optional)
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="e.g. PT-88231"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/95 shadow-md btn-glow transition-all text-sm cursor-pointer"
            >
              Generate Report
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PatientDetailsModal;
