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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 shadow-xl relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Pneumocast Clinical Portal</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRegistering ? 'Register Doctor Account' : 'Radiologist Sign In'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Automated Lung Cancer Subtype PACS Workstation</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-700 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {isRegistering && (
            <>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Doctor Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
                    placeholder="e.g. Dr. Mohammed Izhan, MD"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role / Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
                >
                  <option value="doctor" className="bg-white text-slate-900">Thoracic Radiologist / Doctor</option>
                  <option value="researcher" className="bg-white text-slate-900">Clinical AI Researcher</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Doctor Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
                placeholder="doctor@hospital.org"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isRegistering && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1 font-mono">
              <p className="font-bold text-blue-700">Default Credentials:</p>
              <p>Doctor: <code className="text-slate-900 font-bold">Dr. Mohammed Izhan, MD</code></p>
              <p>Email: <code className="text-slate-900 font-bold">doctor@hospital.org</code></p>
              <p>Password: <code className="text-slate-900 font-bold">doctor123</code></p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : (isRegistering ? 'Create Account & Sign In' : 'Sign In to Clinical Workstation')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center space-x-1.5 mx-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isRegistering ? 'Already have an account? Sign In' : 'Need a new account? Register Doctor Account'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
