import React, { useState } from 'react';
import { Award, FileText, ArrowLeft, ShieldAlert, Layers, Activity } from 'lucide-react';
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
    <div className="space-y-8">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>{generatingReport ? 'Generating PDF...' : 'Download PDF Analysis Report'}</span>
        </button>
      </div>

      {/* Main Result Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Model: {prediction.model_version}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Classification Result: <span className="text-indigo-600">{prediction.predicted_subtype}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Patient: <b>{patient?.full_name || 'Anonymous'}</b> ({patient?.patient_code}) | Analysis ID: #{prediction.id}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl text-center min-w-[140px]">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Confidence Score</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{(prediction.confidence_score * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Per-class probabilities */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900 text-sm">Subtype Probability Distribution</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(probs).map(([subtype, prob]) => {
              const pct = (prob * 100).toFixed(1);
              const isWinning = subtype === prediction.predicted_subtype;
              return (
                <div
                  key={subtype}
                  className={`p-4 rounded-xl border ${isWinning ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20' : 'bg-slate-50 border-slate-200'}`}
                >
                  <p className="text-xs font-semibold text-slate-600 mb-1">{subtype}</p>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className={`text-xl font-bold ${isWinning ? 'text-indigo-700' : 'text-slate-800'}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isWinning ? 'bg-indigo-600' : 'bg-slate-400'}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grad-CAM Viewer */}
      <GradCamViewer
        originalUrl={prediction.original_url}
        gradcamUrl={prediction.gradcam_url}
        predictedSubtype={prediction.predicted_subtype}
        confidenceScore={prediction.confidence_score}
      />

      {/* Academic Disclaimer */}
      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl text-xs text-rose-800 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-0.5">ACADEMIC & CLINICAL DECISION-SUPPORT NOTICE:</p>
          <p>This system is intended as an AI decision-support research tool and NOT as a medical diagnostic device. Predictions are generated by PyTorch deep neural networks and should be verified by a qualified thoracic radiologist.</p>
        </div>
      </div>

    </div>
  );
};
