import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Sparkles, User } from 'lucide-react';
import logoImg from '../../assets/logo/logo.png';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Screen', path: '/screen' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-bg/85 backdrop-blur-md border-b border-blue-100/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logoImg} 
              alt="DermaVision Logo" 
              className="w-10 h-10 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-serif text-2xl font-black text-accent tracking-tight select-none">
              DermaVision
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors duration-250 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-accent/75 hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm font-semibold text-accent/80 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <div className="flex items-center space-x-2 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100/50">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-accent/90">{user.name}</span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-1 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-accent/80 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/screen"
                  className="inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-semibold text-sm px-5 py-2.5 rounded-full btn-glow transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-accent/80 hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className="text-base font-semibold text-accent/80 hover:text-primary py-2"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <hr className="border-slate-100" />

          <div className="pt-2">
            {user ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 bg-blue-50/50 px-4 py-2.5 rounded-custom border border-blue-100/50">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-accent/90">{user.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-2 text-base font-semibold text-accent/85 hover:text-primary py-1"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center space-x-2 text-base font-semibold text-rose-500 py-1 text-left cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="text-center text-base font-semibold text-accent/80 hover:text-primary py-2 border border-slate-200 rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  to="/screen"
                  onClick={handleLinkClick}
                  className="text-center text-base font-semibold bg-primary hover:bg-primary/95 text-white py-2.5 rounded-full"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
