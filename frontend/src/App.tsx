import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, UploadCloud, FileText, ShieldCheck, Cpu } from 'lucide-react';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { UploadPage } from './pages/UploadPage';
import { PredictionResultPage } from './pages/PredictionResultPage';
import { ReportsPage } from './pages/ReportsPage';
import { ResearchPage } from './pages/ResearchPage';
import { ClinicalChatbot } from './components/ClinicalChatbot';
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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
        <Header user={null} activePage="" onNavigate={() => {}} onLogout={() => {}} />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  const currentPatient = activePrediction
    ? patients.find((p) => p.id === activePrediction.image_id) || patients[0]
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white relative">
      <Header user={user} activePage={currentPage} onNavigate={setCurrentPage} onLogout={handleLogout} />

      {/* Main Container Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Workstation Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-4 shrink-0">
          <nav className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm space-y-1.5 font-sans">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'dashboard' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Clinical Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('patients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'patients' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patient Directory</span>
            </button>

            <button
              onClick={() => { setSelectedPatientForUpload(null); setCurrentPage('upload'); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'upload' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Execute CT Scan</span>
            </button>

            <button
              onClick={() => setCurrentPage('research')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'research' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Research & Model Spec</span>
            </button>

            <button
              onClick={() => setCurrentPage('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                currentPage === 'reports' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Reports</span>
            </button>
          </nav>

          {/* Workstation Engine Badge */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs font-sans">
            <div className="flex items-center space-x-2 text-blue-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>PyTorch Engine v2.x</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ResNet-18 + CBAM Channel & Spatial Attention loaded.
            </p>
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
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
              patient={currentPatient}
              onBack={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'research' && (
            <ResearchPage />
          )}

          {currentPage === 'reports' && (
            <ReportsPage reports={reports} />
          )}
        </main>

      </div>

      {/* Oncology Clinical AI Copilot Floating Drawer */}
      <ClinicalChatbot
        currentSubtype={activePrediction?.predicted_subtype || 'Adenocarcinoma (ADC)'}
        confidenceScore={activePrediction?.confidence_score || 0.984}
        patientName={currentPatient?.full_name || 'Patient Directory'}
      />
    </div>
  );
}
