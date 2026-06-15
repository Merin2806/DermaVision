import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-12 relative">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#E1EEFC] floating-blob -z-10"></div>
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-blue-200/50 floating-blob -z-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md glass-card rounded-custom p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoImg} alt="DermaVision Logo" className="w-12 h-12 object-contain" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold font-serif text-accent">Welcome Back</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">DermaVision Portal</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-danger text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-accent/80 uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-accent focus:border-primary focus:outline-none transition-all shadow-sm focus:shadow"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-full shadow-md btn-glow transition-all cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <span className="relative bg-[#FBFDFF] px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">or</span>
        </div>

        {/* Social login */}
        <button
          type="button"
          onClick={() => {
            setEmail('demo.user@dermavision.ai');
            setPassword('password123');
          }}
          className="w-full inline-flex items-center justify-center bg-white hover:bg-slate-50 text-accent font-bold py-3 rounded-full border border-slate-200 transition-colors shadow-sm text-sm cursor-pointer"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
