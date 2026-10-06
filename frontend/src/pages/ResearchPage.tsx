import React from 'react';
import { ShieldCheck, Cpu, Database, Activity } from 'lucide-react';
import { PreprocessingPipelineDiagram } from '../components/PreprocessingPipelineDiagram';

export const ResearchPage: React.FC = () => {
  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <span>Research & Model Technical Card</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            System Architecture, Dataset Metadata, and Benchmark Metrics for Academic Capstone
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-blue-700">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Cap-10 ResNet-18 CBAM Spec</span>
        </div>
      </div>

      {/* Model Technical Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Model Architecture Specs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
            <span>Neural Network Model Card</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-[130px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Backbone</span>
              <span className="font-mono font-bold text-slate-900 text-right">ResNet-18</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Attention Mechanism</span>
              <span className="font-mono font-bold text-blue-600 text-right leading-tight">CBAM (Channel & Spatial)</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Attention Layer</span>
              <span className="font-mono text-slate-800 text-right">Layer 3 & Layer 4</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Primary Classes</span>
              <span className="font-mono font-bold text-slate-900 text-right">3 (ADC, SCC, SCLC)</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Input Resolution</span>
              <span className="font-mono text-slate-800 text-right">224 × 224 × 3</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] items-center gap-2 py-2">
              <span className="text-slate-600 font-medium">Explainability</span>
              <span className="font-mono font-bold text-blue-600 text-right">Grad-CAM (Layer 4)</span>
            </div>
          </div>
        </div>

        {/* Dataset Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>TCIA 355 Cohort Verification</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The dataset originates from the official TCIA <code>Lung-PET-CT-Dx</code> repository (DOI: 10.7937/TCIA.2020.NNC2-0461):
          </p>
          
          <div className="space-y-4 text-xs pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 truncate">Adenocarcinoma (ADC)</span>
                <span className="font-mono font-bold text-blue-700 shrink-0 text-right">251 subjects (70.7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70.7%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 truncate">Squamous Cell Carcinoma (SCC)</span>
                <span className="font-mono font-bold text-emerald-700 shrink-0 text-right">61 subjects (17.2%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '17.2%' }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 truncate">Small Cell Lung Carcinoma (SCLC)</span>
                <span className="font-mono font-bold text-amber-700 shrink-0 text-right">38 subjects (10.7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10.7%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Preprocessing Specifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm border-b border-slate-100 pb-3">
            <Activity className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Preprocessing & HU Windowing</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-[140px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">DICOM Rescale</span>
              <span className="font-mono text-slate-900 text-right leading-tight">Applied (Hounsfield Units)</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Windowing Range</span>
              <span className="font-mono font-bold text-blue-600 text-right">[-1350, +150] HU</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Normalization Scale</span>
              <span className="font-mono text-slate-800 text-right">[0.0, 1.0] Float32</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center gap-2 py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Channel Strategy</span>
              <span className="font-mono text-slate-800 text-right leading-tight">3-Channel Grayscale Expand</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center gap-2 py-2">
              <span className="text-slate-600 font-medium">Grad-CAM Mask</span>
              <span className="font-mono font-bold text-emerald-600 text-right">20px Boundary Masking</span>
            </div>
          </div>
        </div>

      </div>

      {/* Pipeline Flow Diagram */}
      <PreprocessingPipelineDiagram />

    </div>
  );
};
