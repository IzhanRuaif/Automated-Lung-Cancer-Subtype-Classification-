import React from 'react';
import { Activity, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-white">LUNG-AI <span className="text-indigo-400 font-normal text-sm">Decision-Support</span></h1>
            <p className="text-xs text-slate-400">Deep CNN + CBAM Attention Research Engine</p>
          </div>
        </div>

        {/* Status Indicator & User Menu */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium text-slate-300">PyTorch AI Model Online</span>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-right">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                  <p className="text-xs text-indigo-400 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
