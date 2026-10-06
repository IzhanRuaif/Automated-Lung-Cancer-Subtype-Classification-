import React, { useState } from 'react';
import { FileText, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Prediction, Patient } from '../types';
import { GradCamViewer } from '../components/GradCamViewer';
import { api } from '../api/client';

interface PredictionResultPageProps {
  prediction: Prediction;
  patient?: Patient | null;
  onBack: () => void;
}

export const PredictionResultPage: React.FC<PredictionResultPageProps> = ({ prediction, patient, onBack }) => {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const rep = await api.createReport(prediction.id);
      setReportUrl(rep.pdf_url);
      window.open(rep.pdf_url, '_blank');
    } catch (err: any) {
      alert('Failed to generate PDF Report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const probs = prediction.probabilities || {};

  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Controls Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>{generatingReport ? 'Generating Report PDF...' : 'Export PDF Analysis Report'}</span>
        </button>
      </div>

      {/* Main Prediction Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider mb-2">
              Model Backbone: {prediction.model_version || 'ResNet-18 + CBAM'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Predicted Subtype: <span className="text-blue-600">{prediction.predicted_subtype}</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-mono">
              Patient: <b className="text-slate-900">{patient?.full_name || 'Anonymous'}</b> (<span className="text-blue-600 font-bold">{patient?.patient_code}</span>) | Analysis ID: #{prediction.id}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-2xl text-center min-w-[150px] shadow-md">
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Confidence Score</p>
            <p className="text-3xl font-black text-emerald-400 font-mono mt-1">{(prediction.confidence_score * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Probability Distribution Bar Charts */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Subtype Softmax Probability Distribution</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(probs).map(([subtype, prob]) => {
              const pct = (prob * 100).toFixed(1);
              const isWinning = subtype === prediction.predicted_subtype;
              return (
                <div
                  key={subtype}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWinning 
                      ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-400/30' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-700 mb-1">{subtype}</p>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className={`text-xl font-mono font-black ${isWinning ? 'text-blue-700' : 'text-slate-900'}`}>{pct}%</span>
                    {isWinning && <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">PREDICTED</span>}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isWinning ? 'bg-blue-600' : 'bg-slate-400'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* PACS Grad-CAM Spatial Heatmap Viewer */}
      <GradCamViewer
        originalUrl={prediction.original_url}
        gradcamUrl={prediction.gradcam_url}
        predictedSubtype={prediction.predicted_subtype}
        confidenceScore={prediction.confidence_score}
      />

      {/* Academic Disclaimer Notice */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 mb-0.5 uppercase tracking-wider">Academic & Clinical Decision-Support Notice:</p>
          <p className="text-amber-800 leading-relaxed">
            This system is intended as an AI decision-support research tool and NOT as a standalone diagnostic device. Predictions are generated by PyTorch deep neural networks and should be verified by a qualified thoracic radiologist.
          </p>
        </div>
      </div>

    </div>
  );
};
