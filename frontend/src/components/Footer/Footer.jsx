import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Mail, Info } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';

const Footer = () => {
  return (
    <footer className="bg-accent text-white mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={logoImg} 
                alt="DermaVision Logo" 
                className="w-10 h-10 object-contain rounded-lg brightness-110"
              />
              <span className="font-serif text-2xl font-black text-white tracking-tight">
                DermaVision
              </span>
            </Link>
            <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
              Empowering individuals with instant, secure, AI-powered skin analysis for early screening and dermatological wellness.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>HIPAA Compliant Protocol Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-secondary mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/screen" className="hover:text-white transition-colors">Skin Screening</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About & Technology</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Account & Help */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-secondary mb-4">Support & Account</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">Create Account</Link>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>support@dermavision.ai</span>
              </li>
              <li className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                <Info className="w-4 h-4" />
                <span>Regulatory Info</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        {/* Disclaimer & Bottom Details */}
        <div className="flex flex-col lg:flex-row items-center justify-between text-xs text-slate-400 space-y-4 lg:space-y-0">
          <div className="max-w-2xl text-center lg:text-left leading-relaxed">
            <span className="font-bold text-slate-300">Medical Disclaimer: </span>
            This screening tool is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a certified dermatologist for clinical diagnoses.
          </div>
          <div className="flex items-center space-x-1 font-medium text-slate-400">
            <span>&copy; {new Date().getFullYear()} DermaVision. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for clinical wellness.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
