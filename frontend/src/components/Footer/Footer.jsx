import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Mail, Info, X, Users } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';

/* ─── Team Data ──────────────────────────────────────────────── */
const TEAM = [
  {
    name: 'Merin Joys',
    role: 'Full Stack Developer',
    initials: 'MJ',
    accent: '#3b82f6',
  },
  {
    name: 'Riya Mokale',
    role: 'AI / ML Engineer',
    initials: 'RM',
    accent: '#8b5cf6',
  },
  {
    name: 'Snehal Mascarenhas',
    role: 'Frontend Developer',
    initials: 'SM',
    accent: '#06b6d4',
  },
  {
    name: 'Justin Sunil',
    role: 'Backend Developer',
    initials: 'JS',
    accent: '#10b981',
  },
];

/* ─── Inline Styles ──────────────────────────────────────────── */
const styles = {
  /* "Meet the Team" footer link */
  meetLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
    fontSize: '0.75rem',
    color: '#94a3b8',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },

  /* ── Modal overlay ── */
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },

  /* ── Modal box ── */
  modal: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '40px 36px 36px',
    width: '100%',
    maxWidth: '560px',
    position: 'relative',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)',
  },

  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#64748b',
    transition: 'background 0.2s ease, color 0.2s ease',
  },

  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.02em',
  },

  modalSubtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '6px 0 28px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '14px',
  },

  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '16px',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },

  avatar: (accent) => ({
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: `${accent}18`,
    border: `2px solid ${accent}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: accent,
    flexShrink: 0,
    letterSpacing: '0.02em',
  }),

  cardName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.3,
  },

  cardRole: {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: '3px 0 0',
    lineHeight: 1.3,
  },
};

/* ─── Keyframe injection (runs once) ────────────────────────── */
const KEYFRAME_ID = 'dermavision-team-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(KEYFRAME_ID)) {
  const sheet = document.createElement('style');
  sheet.id = KEYFRAME_ID;
  sheet.textContent = `
    @keyframes dv-fadeIn  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes dv-fadeOut { from { opacity: 1 } to { opacity: 0 } }
    @keyframes dv-scaleIn {
      from { opacity: 0; transform: scale(0.88) translateY(12px) }
      to   { opacity: 1; transform: scale(1)    translateY(0)     }
    }
    @keyframes dv-scaleOut {
      from { opacity: 1; transform: scale(1)    translateY(0)     }
      to   { opacity: 0; transform: scale(0.88) translateY(12px)  }
    }
  `;
  document.head.appendChild(sheet);
}

/* ─── TeamModal Component ────────────────────────────────────── */
const TeamModal = ({ open, onClose }) => {
  const [closing, setClosing] = useState(false);

  /* Trigger exit animation then unmount */
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 220);
  }, [onClose]);

  /* Esc key */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else       document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open && !closing) return null;

  const overlayAnim  = closing ? 'dv-fadeOut 0.22s ease forwards'  : 'dv-fadeIn 0.22s ease forwards';
  const modalAnim    = closing ? 'dv-scaleOut 0.22s ease forwards' : 'dv-scaleIn 0.25s ease forwards';

  return (
    <div
      style={{ ...styles.overlay, animation: overlayAnim }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dv-team-title"
    >
      <div
        style={{ ...styles.modal, animation: modalAnim }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          style={styles.closeBtn}
          onClick={handleClose}
          aria-label="Close"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e2e8f0';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Users size={22} style={{ color: '#3b82f6' }} />
          <h2 id="dv-team-title" style={styles.modalTitle}>Meet the Developers</h2>
        </div>
        <p style={styles.modalSubtitle}>The team behind DermaVision.</p>

        {/* Team grid */}
        <div style={styles.grid}>
          {TEAM.map((member) => (
            <div
              key={member.name}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.avatar(member.accent)}>{member.initials}</div>
              <div>
                <p style={styles.cardName}>{member.name}</p>
                <p style={styles.cardRole}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Footer Component ───────────────────────────────────────── */
const Footer = () => {
  const [teamOpen, setTeamOpen] = useState(false);

  return (
    <>
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
                  <Link to="/about" className="hover:text-white transition-colors">About &amp; Technology</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link>
                </li>
              </ul>
            </div>

            {/* Account & Help */}
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-secondary mb-4">Support &amp; Account</h4>
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

            {/* Copyright + Meet the Team */}
            <div className="flex flex-col items-center lg:items-end gap-1">
              <div className="flex items-center space-x-1 font-medium text-slate-400">
                <span>&copy; {new Date().getFullYear()} DermaVision. Built with</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>for clinical wellness.</span>
              </div>

              {/* ── Meet the Team link ── */}
              <button
                onClick={() => setTeamOpen(true)}
                style={styles.meetLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#93c5fd';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.textDecoration = 'none';
                }}
                aria-label="Open Meet the Team modal"
              >
                <span>👥</span>
                <span>Meet the Team</span>
                <span
                  style={{
                    display: 'inline-block',
                    transition: 'transform 0.2s ease',
                  }}
                  className="dv-arrow"
                >
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Team Modal (rendered outside footer via React portal-like pattern) */}
      <TeamModal open={teamOpen} onClose={() => setTeamOpen(false)} />
    </>
  );
};

export default Footer;
