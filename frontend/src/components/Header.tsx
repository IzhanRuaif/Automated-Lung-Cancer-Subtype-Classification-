import React from 'react';
import { Activity, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, activePage, onNavigate, onLogout }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Workstation Title */}
        <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => user && onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1 leading-none">
                PNEUMO<span className="text-blue-600">CAST</span>
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                v1.0 CBAM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5 whitespace-nowrap hidden sm:block">Lung Cancer Subtype PACS Workstation</p>
          </div>
        </div>

        {/* Center / Right Telemetry Badge & Doctor Profile */}
        <div className="flex items-center space-x-4 shrink-0 ml-auto">
          <div className="hidden md:flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>TCIA 355 Cohort Verified</span>
          </div>

          {user && (
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-4 shrink-0">
              <div className="flex items-center space-x-2.5 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-0.5 capitalize leading-none">{user.role} Radiologist</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200 hover:border-rose-200 flex items-center space-x-1 shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-700 hover:text-rose-600 hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
