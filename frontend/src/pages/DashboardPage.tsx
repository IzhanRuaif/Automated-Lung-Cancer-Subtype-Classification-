import React from 'react';
import { Users, FileText, Activity, Layers, ArrowRight, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { Patient, Report } from '../types';
import { PreprocessingPipelineDiagram } from '../components/PreprocessingPipelineDiagram';
import { ResearchCharts } from '../components/ResearchCharts';

interface DashboardPageProps {
  patients: Patient[];
  reports: Report[];
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ patients, reports, onNavigate }) => {
  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-mono font-bold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Academic Capstone System • 10-Credit Medical Workstation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Automated Lung Cancer Subtype Decision Support Workstation
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Deep Convolutional Neural Network (<b>ResNet-18</b>) enhanced with <b>Channel & Spatial Attention (CBAM)</b> for 
            pathologically confirmed histopathological subtype classification and <b>Grad-CAM visual spatial heatmaps</b>.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/30 flex items-center space-x-2 transition-all"
            >
              <span>Execute CT Scan Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('patients')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all"
            >
              Manage Patient Records
            </button>
            <button
              onClick={() => onNavigate('research')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded-xl border border-white/20 transition-all flex items-center space-x-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Technical Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered Patients</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TCIA CT Cohort</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">355</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attention Model</p>
            <p className="text-base font-black text-slate-900 font-mono mt-0.5">ResNet-18 + CBAM</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PDF Reports</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{reports.length}</p>
          </div>
        </div>

      </div>

      {/* Benchmark Visualizations & Interactive Analytics */}
      <ResearchCharts />

      {/* Workflow Diagram */}
      <PreprocessingPipelineDiagram />

      {/* Dataset Summary & Patient Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TCIA Cohort Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Dataset Verification (TCIA)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Official TCIA <code>Lung-PET-CT-Dx</code> verified subject distribution (DOI: 10.7937/TCIA.2020.NNC2-0461):
          </p>
          
          <div className="space-y-4 pt-1 text-xs">
            <div>
              <div className="flex justify-between items-center font-semibold text-slate-800 mb-1">
                <span>Adenocarcinoma (ADC)</span>
                <span className="font-mono font-bold text-blue-700">251 subjects (70.7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70.7%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-semibold text-slate-800 mb-1">
                <span>Squamous Cell Carcinoma (SCC)</span>
                <span className="font-mono font-bold text-emerald-700">61 subjects (17.2%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '17.2%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-semibold text-slate-800 mb-1">
                <span>Small Cell Lung Carcinoma (SCLC)</span>
                <span className="font-mono font-bold text-amber-700">38 subjects (10.7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10.7%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center font-semibold text-slate-800 mb-1">
                <span>Large Cell Carcinoma (LCC)</span>
                <span className="font-mono font-bold text-rose-700">5 subjects (1.4%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '1.4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Registered Patients */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Registered Patient Directory</span>
            </h3>
            <button
              onClick={() => onNavigate('patients')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Patients →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {patients.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900">{p.full_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Code: <code className="text-blue-600 font-mono font-bold">{p.patient_code}</code> | {p.age} yrs, {p.gender}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('upload')}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors flex items-center space-x-1"
                >
                  <span>Execute CT</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
