import React from 'react';
import { Layers, Cpu, ShieldCheck, FileCheck, Eye, Activity } from 'lucide-react';

export const PreprocessingPipelineDiagram: React.FC = () => {
  const stages = [
    { step: '01', stage: 'Raw Image', title: 'CT DICOM Slice', desc: 'Axial CT slice input (.dcm, .png, .jpg)', icon: FileCheck },
    { step: '02', stage: 'Normalization', title: 'HU Windowing', desc: 'Rescale [-1350, +150] HU clipping', icon: Activity },
    { step: '03', stage: 'Preprocessing', title: 'PyTorch Tensor', desc: 'Float32 (1, 3, 224, 224) ImageNet scale', icon: Layers },
    { step: '04', stage: 'Neural Network', title: 'ResNet-18 + CBAM', desc: 'Channel & Spatial Attention features', icon: Cpu },
    { step: '05', stage: 'Inference', title: 'Logits & Softmax', desc: 'Subtype probability distribution', icon: ShieldCheck },
    { step: '06', stage: 'Explainability', title: 'Grad-CAM Map', desc: 'Layer 4 spatial saliency heatmap', icon: Eye },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-none">CT Processing & Model Inference Pipeline</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">End-to-End Deep Learning Methodology Flow</p>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 font-bold whitespace-nowrap hidden sm:inline-block">
          Methodology Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {stages.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 flex flex-col justify-between space-y-3 relative group hover:bg-white hover:border-blue-300 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-2">
                  <span className="font-mono text-xs font-bold text-blue-600 tracking-wider">STEP {s.step}</span>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider leading-none mb-1">{s.stage}</p>
                <h4 className="font-extrabold text-xs text-slate-900 leading-snug">{s.title}</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal pt-2 border-t border-slate-200/40">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
