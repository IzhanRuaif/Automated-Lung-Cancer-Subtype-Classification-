import React, { useState } from 'react';
import { Sliders, Cpu, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';

interface ModelControlPanelProps {
  onParametersChange?: (params: { engine: string; alpha: number; threshold: number; topK: number }) => void;
}

export const ModelControlPanel: React.FC<ModelControlPanelProps> = ({ onParametersChange }) => {
  const [engineMode, setEngineMode] = useState<'cbam' | 'baseline' | 'binary'>('cbam');
  const [alpha, setAlpha] = useState<number>(0.72);
  const [threshold, setThreshold] = useState<number>(0.85);
  const [topK, setTopK] = useState<number>(3);

  const handleAlphaChange = (val: number) => {
    setAlpha(val);
    onParametersChange?.({ engine: engineMode, alpha: val, threshold, topK });
  };

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    onParametersChange?.({ engine: engineMode, alpha, threshold: val, topK });
  };

  const handleEngineChange = (mode: 'cbam' | 'baseline' | 'binary') => {
    setEngineMode(mode);
    onParametersChange?.({ engine: mode, alpha, threshold, topK });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 font-sans text-slate-900">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-none">Model & Parameter Control Panel</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Interactive Attention Tuning & Threshold Gating</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 whitespace-nowrap">
          Adaptive Tuning Active
        </span>
      </div>

      {/* Engine Mode Selection Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Classification Engine Architecture</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <button
            type="button"
            onClick={() => handleEngineChange('cbam')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              engineMode === 'cbam'
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs text-slate-900">Proposed CBAM Attention</span>
              <Cpu className={`w-4 h-4 ${engineMode === 'cbam' ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">ResNet-18 with Channel & Spatial Attention on Layers 3 & 4</p>
          </button>

          <button
            type="button"
            onClick={() => handleEngineChange('baseline')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              engineMode === 'baseline'
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs text-slate-900">Baseline ResNet-18</span>
              <Layers className={`w-4 h-4 ${engineMode === 'baseline' ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">Standard Convolutional Neural Network without attention modules</p>
          </button>

          <button
            type="button"
            onClick={() => handleEngineChange('binary')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              engineMode === 'binary'
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-xs text-slate-900">Binary Screener</span>
              <ShieldCheck className={`w-4 h-4 ${engineMode === 'binary' ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">Fast 2-class screening model (Malignant vs Benign)</p>
          </button>

        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
        
        {/* Slider 1: Attention Ratio */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Channel vs Spatial Attention Ratio (α)</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {alpha < 0.3 ? 'Spatial Focused' : alpha > 0.7 ? 'Channel Focused' : 'Balanced CBAM'} ({alpha.toFixed(2)})
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.02"
            value={alpha}
            onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.0 (Spatial Only)</span>
            <span>0.5 (Balanced)</span>
            <span>1.0 (Channel Only)</span>
          </div>
        </div>

        {/* Slider 2: Confidence Gate Threshold */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Confidence Gate Threshold (τ)</span>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {(threshold * 100).toFixed(0)}% Minimum
            </span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>50% (High Recall)</span>
            <span>75% (Balanced)</span>
            <span>95% (High Precision)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
