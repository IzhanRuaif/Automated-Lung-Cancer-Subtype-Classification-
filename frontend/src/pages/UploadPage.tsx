import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { Patient, Prediction } from '../types';
import { api } from '../api/client';
import { PreprocessingPipelineDiagram } from '../components/PreprocessingPipelineDiagram';

interface UploadPageProps {
  patients: Patient[];
  selectedPatient?: Patient | null;
  onAnalysisComplete: (prediction: Prediction) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ patients, selectedPatient, onAnalysisComplete }) => {
  const [patientId, setPatientId] = useState<number>(selectedPatient ? selectedPatient.id : (patients[0]?.id || 0));
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !patientId) {
      setError('Please select a valid patient and CT file.');
      return;
    }

    setUploading(true);
    setError('');
    setStatusText('1/3 Uploading CT DICOM / Image file...');

    try {
      const imageRecord = await api.uploadCTImage(patientId, file);
      
      setStatusText('2/3 Executing ResNet-18 + CBAM Attention Model & Grad-CAM...');
      const predictionRecord = await api.predict(imageRecord.id);

      setStatusText('3/3 Analysis Complete! Redirecting to Result View...');
      setTimeout(() => {
        onAnalysisComplete(predictionRecord);
      }, 800);

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete CT image analysis pipeline.');
      setUploading(false);
    }
  };

  const handleUseDemoScan = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 224, 224);
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.ellipse(75, 112, 45, 70, 0, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.ellipse(149, 112, 45, 70, 0, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(70, 95, 18, 0, 2 * Math.PI); ctx.fill();
    }
    canvas.toBlob((blob) => {
      if (blob) {
        const demoFile = new File([blob], 'demo_lung_ct_scan.png', { type: 'image/png' });
        setFile(demoFile);
        setError('');
      }
    }, 'image/png');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans text-slate-900">
      
      {/* Header */}
      <div className="text-center space-y-2 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <UploadCloud className="w-6 h-6 text-blue-600" />
          <span>Execute CT Scan Analysis</span>
        </h2>
        <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto">
          Upload DICOM (`.dcm`) or image (`.png`, `.jpg`) CT slices for deep learning subtype classification and Grad-CAM spatial heatmap explanation.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-700 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Workstation Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        
        {/* Select Patient */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Target Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 font-medium rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id} className="text-slate-900 bg-white font-medium py-1">
                {p.patient_code} - {p.full_name} ({p.age} yrs, {p.gender})
              </option>
            ))}
          </select>
        </div>

        {/* Drag & Drop File Zone */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">CT Scan File (.dcm, .png, .jpg)</label>
            <button
              type="button"
              onClick={handleUseDemoScan}
              className="text-xs font-mono text-blue-600 hover:text-blue-800 font-bold underline"
            >
              + Load Synthetic Test Scan
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors relative cursor-pointer group">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".dcm,.png,.jpg,.jpeg"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-3 pointer-events-none">
              <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {file ? file.name : 'Click or drag CT scan slice here to upload'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-1">Supports DICOM (.dcm) and PNG/JPG slices up to 50MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        {uploading && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs font-mono">
              <Cpu className="w-4 h-4 text-blue-600 animate-spin" />
              <span>{statusText}</span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '85%' }}></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{uploading ? 'Executing Neural Network Model...' : 'Run AI Subtype Classification & Grad-CAM'}</span>
        </button>

      </form>

      {/* Preprocessing Methodology Pipeline */}
      <PreprocessingPipelineDiagram />

    </div>
  );
};
