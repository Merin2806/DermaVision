import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Plus, Calendar, BarChart3, PieChart, 
  ChevronRight, Eye, ShieldAlert, AlertCircle, CheckCircle2, Trash2 
} from 'lucide-react';

const Dashboard = ({ user, history, onDeleteScan, onSelectScan }) => {
  const navigate = useNavigate();
  const [selectedScanDetails, setSelectedScanDetails] = useState(null);

  // If user is not logged in, show a premium sign-in CTA card or mock a default user
  const username = user ? user.name : 'Guest User';

  // Calculations for stats
  const totalScans = history.length;
  const mildCount = history.filter(s => s.severity === 'Mild').length;
  const moderateCount = history.filter(s => s.severity === 'Moderate').length;
  const severeCount = history.filter(s => s.severity === 'Severe').length;

  // Group by condition for analytics
  const conditionCounts = history.reduce((acc, curr) => {
    acc[curr.condition] = (acc[curr.condition] || 0) + 1;
    return acc;
  }, {});

  const handleViewScan = (scan) => {
    onSelectScan(scan);
    navigate('/result');
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Mild':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Severe':
        return 'bg-rose-50 text-rose-700 border-rose-250';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Mild':
        return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
      case 'Moderate':
        return <AlertCircle className="w-3.5 h-3.5 text-warning" />;
      case 'Severe':
        return <ShieldAlert className="w-3.5 h-3.5 text-danger" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-10 lg:px-8 space-y-8"
    >
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-blue-100/30 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-accent font-black">
            Welcome back, {username} 👋
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor your screening history, statistics, and clinical indicators.
          </p>
        </div>
        <Link
          to="/screen"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-bold px-5 py-3 rounded-full shadow-md btn-glow transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>New Screening</span>
        </Link>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', val: totalScans, color: 'text-primary', bg: 'bg-blue-50/50 border-blue-100/65' },
          { label: 'Mild Cases', val: mildCount, color: 'text-success', bg: 'bg-emerald-50/40 border-emerald-100/50' },
          { label: 'Moderate Cases', val: moderateCount, color: 'text-warning', bg: 'bg-amber-50/40 border-amber-100/50' },
          { label: 'Severe Cases', val: severeCount, color: 'text-danger', bg: 'bg-rose-50/40 border-rose-100/50' }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className={`glass-card rounded-custom p-6 border ${stat.bg} shadow-sm flex flex-col justify-between`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</span>
            <span className={`text-4xl font-serif font-black ${stat.color} mt-2`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {/* 3. Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Severity Breakdown (Bar chart) */}
        <div className="lg:col-span-7 glass-card rounded-custom p-6 shadow-md border border-slate-100 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-bold font-serif text-accent">Severity Breakdown</h3>
          </div>

          <div className="h-64 flex items-end justify-around pt-6 pb-2 px-4 border-b border-slate-100">
            {[
              { label: 'Mild', val: mildCount, pct: totalScans ? (mildCount / totalScans) * 100 : 0, color: 'bg-success' },
              { label: 'Moderate', val: moderateCount, pct: totalScans ? (moderateCount / totalScans) * 100 : 0, color: 'bg-warning' },
              { label: 'Severe', val: severeCount, pct: totalScans ? (severeCount / totalScans) * 100 : 0, color: 'bg-danger' }
            ].map((bar, idx) => (
              <div key={idx} className="flex flex-col items-center w-16 group">
                <div className="text-xs font-bold text-accent mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {bar.val}
                </div>
                {/* Visual Bar container */}
                <div className="w-10 bg-slate-50 border border-slate-100 rounded-t-lg h-48 flex items-end overflow-hidden relative shadow-inner">
                  <motion.div 
                    className={`w-full ${bar.color} rounded-t-md`}
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400 tracking-wide mt-2">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Analytics (Pie/Donut list) */}
        <div className="lg:col-span-5 glass-card rounded-custom p-6 shadow-md border border-slate-100 space-y-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-bold font-serif text-accent">Condition Analytics</h3>
          </div>

          {totalScans === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-medium">
              No scans completed yet.
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {Object.entries(conditionCounts).map(([condition, count], idx) => {
                const percentage = ((count / totalScans) * 100).toFixed(1);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-accent/80">
                      <span className="truncate">{condition}</span>
                      <span className="shrink-0">{count} ({percentage}%)</span>
                    </div>
                    {/* Visual Progress row */}
                    <div className="w-full bg-slate-50 border border-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.15 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. History Table */}
      <div className="glass-card rounded-custom p-6 shadow-md border border-slate-100">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
          <h3 className="text-xl font-bold font-serif text-accent flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            <span>Screening History</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
            {totalScans} Scan Records
          </span>
        </div>

        {totalScans === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-slate-400 text-sm font-medium">You haven't completed any skin screenings yet.</p>
            <div className="flex justify-center">
              <Link 
                to="/screen"
                className="inline-flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-primary font-bold px-5 py-2.5 rounded-full border border-blue-150 transition-colors"
              >
                <span>Run First Screening</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Condition</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((scan) => (
                  <tr 
                    key={scan.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-blue-50/10 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-slate-500 whitespace-nowrap">
                      {new Date(scan.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-bold text-accent">
                      {scan.condition}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 border px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSeverityBadge(scan.severity)}`}>
                        {getSeverityIcon(scan.severity)}
                        <span className="ml-1">{scan.severity}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-600">
                      {scan.confidence.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleViewScan(scan)}
                        className="inline-flex items-center justify-center p-2 text-primary hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                        title="View Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteScan(scan.id)}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Delete Scan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
