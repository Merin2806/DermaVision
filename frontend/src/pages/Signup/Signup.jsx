import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Check, Eye, EyeOff, X } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';

const Signup = ({ onSignup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Password requirement checks
  const passwordChecks = useMemo(() => ([
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ]), [password]);

  const allPasswordChecksMet = passwordChecks.every(c => c.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!allPasswordChecksMet) {
      setError('Password does not meet all requirements.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy to register.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await onSignup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to the server. Please ensure the backend is running on port 5001.');
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Acne Screening',
    'Eczema Detection',
    'Severity Assessment',
    'Dashboard'
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#E1EEFC] floating-blob -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-200/40 floating-blob -z-10"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Features Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-5 glass-card rounded-custom p-8 shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-6">
            <Link to="/" className="inline-flex">
              <img src={logoImg} alt="DermaVision Logo" className="w-10 h-10 object-contain" />
            </Link>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold font-serif text-accent leading-tight">Join DermaVision</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Unlock early clinical screening features and secure clinical tracking dashboards instantly.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 my-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-white/70 p-3 rounded-xl border border-slate-100/60 shadow-sm">
                <div className="p-1 bg-emerald-50 border border-emerald-100 rounded-full text-success">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-accent/80 tracking-wide">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 leading-relaxed">
            By creating an account, you agree to our <Link to="/terms" className="underline font-semibold hover:text-primary">terms of service</Link>, <Link to="/terms" className="underline font-semibold hover:text-primary">privacy protocols</Link>, and <Link to="/terms" className="underline font-semibold hover:text-primary">medical disclaimer</Link> statements.
          </div>
        </motion.div>

        {/* Signup Form Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-7 glass-card rounded-custom p-8 shadow-xl flex flex-col justify-center"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold font-serif text-accent">Create Your Account</h3>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Secure Registration</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-danger text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-accent/80 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-accent focus:border-primary focus:outline-none transition-all shadow-sm focus:shadow"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-accent/80 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-accent focus:border-primary focus:outline-none transition-all shadow-sm focus:shadow"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-accent/80 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm text-accent focus:border-primary focus:outline-none transition-all shadow-sm focus:shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2"
              >
                <p className="text-[10px] font-bold text-accent/60 uppercase tracking-wider">Password Requirements</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {passwordChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2 text-xs font-medium transition-colors duration-200 ${
                        check.met ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {check.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start space-x-2.5 pt-1">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 accent-primary cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-500 leading-normal select-none cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="font-bold text-primary hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/terms" className="font-bold text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreeTerms || !allPasswordChecksMet}
              className={`w-full inline-flex items-center justify-center font-bold py-3.5 rounded-full shadow-md transition-all ${
                agreeTerms && allPasswordChecksMet && !loading
                  ? 'bg-primary hover:bg-primary/95 text-white btn-glow cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
              }`}
            >
              {loading ? 'Registering...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
