import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, UploadCloud, FileText, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { UploadPage } from './pages/UploadPage';
import { PredictionResultPage } from './pages/PredictionResultPage';
import { ReportsPage } from './pages/ReportsPage';
import { api } from './api/client';
import { User, Patient, Prediction, Report } from './types';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  
  const [selectedPatientForUpload, setSelectedPatientForUpload] = useState<Patient | null>(null);
  const [activePrediction, setActivePrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ email: 'doctor@hospital.org', name: 'Dr. Mohammed Izhan, MD', role: 'doctor' });
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const pData = await api.getPatients();
      setPatients(pData);
      const rData = await api.getReports();
      setReports(rData);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  };

  const handleLoginSuccess = (userData: User, token: string) => {
    setUser(userData);
    fetchInitialData();
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
        <Header user={null} activePage="" onNavigate={() => {}} onLogout={() => {}} />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Header user={user} activePage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-4 shrink-0">
          <nav className="glass-card p-3 rounded-3xl border border-slate-800 shadow-2xl space-y-1.5">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'dashboard' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Clinical Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('patients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'patients' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patient Directory</span>
            </button>

            <button
              onClick={() => { setSelectedPatientForUpload(null); setCurrentPage('upload'); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'upload' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Execute CT Scan</span>
            </button>

            <button
              onClick={() => setCurrentPage('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'reports' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Reports</span>
            </button>
          </nav>

          {/* Quick System Badge */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>PyTorch Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              ResNet-18 + CBAM Channel & Spatial Attention loaded.
            </p>
          </div>
        </aside>

        {/* Dynamic Page Workspace */}
        <main className="flex-1 min-w-0">
          {currentPage === 'dashboard' && (
            <DashboardPage patients={patients} reports={reports} onNavigate={setCurrentPage} />
          )}

          {currentPage === 'patients' && (
            <PatientsPage
              patients={patients}
              onRefresh={fetchInitialData}
              onSelectPatientForUpload={(pt) => {
                setSelectedPatientForUpload(pt);
                setCurrentPage('upload');
              }}
            />
          )}

          {currentPage === 'upload' && (
            <UploadPage
              patients={patients}
              selectedPatient={selectedPatientForUpload}
              onAnalysisComplete={(pred) => {
                setActivePrediction(pred);
                fetchInitialData();
                setCurrentPage('result');
              }}
            />
          )}

          {currentPage === 'result' && activePrediction && (
            <PredictionResultPage
              prediction={activePrediction}
              patient={patients.find((p) => p.id === activePrediction.image_id) || patients[0]}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage reports={reports} />
          )}
        </main>

      </div>
    </div>
  );
}
