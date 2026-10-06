import React, { useState } from 'react';
import { Activity, Lock, Mail, ShieldAlert, ArrowRight, Sparkles, User as UserIcon, UserPlus } from 'lucide-react';
import { api } from '../api/client';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('doctor@hospital.org');
  const [password, setPassword] = useState('doctor123');
  const [fullName, setFullName] = useState('Dr. Mohammed Izhan, MD');
  const [role, setRole] = useState('doctor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (isRegistering) {
        data = await api.register(email, password, fullName, role);
      } else {
        data = await api.login(email, password);
      }
      localStorage.setItem('access_token', data.access_token);
      onLoginSuccess(
        { email: data.user_email, name: data.user_name || fullName, role: 'doctor' },
        data.access_token
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 medical-grid-bg">
      <div className="glass-card max-w-md w-full rounded-3xl border border-slate-800 p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Halo Effect */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 border border-cyan-400/30">
            <Activity className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>PACS Decision Support Portal</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isRegistering ? 'Register New Doctor Account' : 'Radiologist Portal Sign In'}
            </h2>
            <p className="text-xs text-slate-400">Automated Lung Cancer Subtype Classification Engine</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl text-xs text-rose-300 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {isRegistering && (
            <>
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">Full Doctor Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                    placeholder="e.g. Dr. Mohammed Izhan, MD"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">Role / Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="doctor" className="text-slate-900 bg-white">Thoracic Radiologist / Doctor</option>
                  <option value="researcher" className="text-slate-900 bg-white">Clinical AI Researcher</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">Doctor Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                placeholder="doctor@hospital.org"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isRegistering && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
              <p className="font-bold text-cyan-400">Default Credentials:</p>
              <p>Doctor: <code className="text-white">Dr. Mohammed Izhan, MD</code></p>
              <p>Email: <code className="text-white">doctor@hospital.org</code></p>
              <p>Password: <code className="text-white">doctor123</code></p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : (isRegistering ? 'Create Doctor Account & Sign In' : 'Sign In to Clinical Workstation')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Sign In and Registration */}
        <div className="text-center border-t border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center space-x-1.5 mx-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isRegistering ? 'Already have an account? Sign In' : 'Need a new account? Register Doctor Account'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
