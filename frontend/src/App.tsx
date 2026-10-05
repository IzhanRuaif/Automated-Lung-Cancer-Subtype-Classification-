import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, UploadCloud, FileText, Activity } from 'lucide-react';
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
      setUser({ email: 'doctor@hospital.org', name: 'Dr. Alex Morgan, MD', role: 'doctor' });
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
      <div className="min-h-screen bg-slate-900 font-sans">
        <Header user={null} onLogout={() => {}} />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header user={user} onLogout={handleLogout} />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-2 shrink-0">
          <nav className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentPage === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentPage('patients')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentPage === 'patients' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Users className="w-4 h-4" />
              <span>Patients Directory</span>
            </button>

            <button
              onClick={() => { setSelectedPatientForUpload(null); setCurrentPage('upload'); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentPage === 'upload' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyze CT Scan</span>
            </button>

            <button
              onClick={() => setCurrentPage('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${currentPage === 'reports' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Reports</span>
            </button>
          </nav>
        </aside>

        {/* Dynamic Page Workspace */}
        <main className="flex-1">
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
