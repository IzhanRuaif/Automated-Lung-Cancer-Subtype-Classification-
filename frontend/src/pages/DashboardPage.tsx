import React from 'react';
import { Users, FileText, Activity, Layers, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Patient, Report } from '../types';

interface DashboardPageProps {
  patients: Patient[];
  reports: Report[];
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ patients, reports, onNavigate }) => {
  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Research Capstone System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Automated Lung Cancer Subtype Decision Support</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Deep Convolutional Neural Network (ResNet-50) enhanced with <b>Channel & Spatial Attention (CBAM)</b> for 
            pathologically confirmed histopathological subtype classification and <b>Grad-CAM visual spatial heatmaps</b>.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-500/30 flex items-center space-x-2 transition-all"
            >
              <span>Upload New CT Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('patients')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition-all"
            >
              Manage Patient Records
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
            <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total CT Analyses</p>
            <p className="text-2xl font-bold text-slate-900">355</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attention Model</p>
            <p className="text-lg font-bold text-slate-900">CBAM ResNet-50</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PDF Reports</p>
            <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
          </div>
        </div>
      </div>

      {/* Dataset Summary & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dataset Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Dataset Verification (TCIA)</span>
          </h3>
          <p className="text-xs text-slate-500">Official TCIA <code>Lung-PET-CT-Dx</code> verified subject distribution (DOI: 10.7937/TCIA.2020.NNC2-0461):</p>
          
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Adenocarcinoma (ADC)</span>
                <span>251 subjects (70.7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70.7%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Squamous Cell Carcinoma (SCC)</span>
                <span>61 subjects (17.2%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '17.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Small Cell Lung Carcinoma (SCLC)</span>
                <span>38 subjects (10.7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10.7%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Large Cell Carcinoma (LCC)</span>
                <span>5 subjects (1.4%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '1.4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Patient List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Registered Patients</h3>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All Patients →
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden">
            {patients.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{p.full_name}</p>
                  <p className="text-xs text-slate-500">Code: <code className="text-indigo-600 font-mono">{p.patient_code}</code> | {p.age} yrs, {p.gender}</p>
                </div>
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 text-xs font-medium rounded-md border border-slate-200 transition-colors"
                >
                  Analyze CT
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
