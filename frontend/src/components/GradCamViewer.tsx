import React, { useState } from 'react';
import { Eye, Layers, Sliders } from 'lucide-react';

interface GradCamViewerProps {
  originalUrl?: string;
  gradcamUrl?: string;
  predictedSubtype: string;
  confidenceScore: number;
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  originalUrl,
  gradcamUrl,
  predictedSubtype,
  confidenceScore,
}) => {
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side' | 'heatmap'>('overlay');
  const [opacity, setOpacity] = useState<number>(0.65);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Viewer Controls Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-sm">Grad-CAM Explainability Engine</h3>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('overlay')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'overlay' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Overlay View
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-md transition-colors ${viewMode === 'side-by-side' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Side-by-Side
            </button>
          </div>

          {viewMode === 'overlay' && (
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300">Opacity: {(opacity * 100).toFixed(0)}%</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[340px]">
        {viewMode === 'overlay' && (
          <div className="relative rounded-lg overflow-hidden border border-slate-800 shadow-2xl max-w-md w-full">
            {/* Background Original CT */}
            <img
              src={originalUrl || '/static/gradcam/sample_ct.png'}
              alt="Original CT Scan"
              className="w-full h-auto object-cover"
            />
            {/* Overlay Grad-CAM Heatmap */}
            {gradcamUrl && (
              <img
                src={gradcamUrl}
                alt="Grad-CAM Spatial Heatmap"
                style={{ opacity }}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 pointer-events-none mix-blend-screen"
              />
            )}
          </div>
        )}

        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-xs font-semibold text-slate-400 mb-2">Original CT Scan (Axial View)</p>
              <img
                src={originalUrl || '/static/gradcam/sample_ct.png'}
                alt="Original CT"
                className="w-full h-64 object-contain rounded bg-black"
              />
            </div>
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-xs font-semibold text-indigo-400 mb-2">Grad-CAM Spatial Attention Heatmap</p>
              <img
                src={gradcamUrl || '/static/gradcam/sample_ct.png'}
                alt="Grad-CAM Heatmap"
                className="w-full h-64 object-contain rounded bg-black"
              />
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 mt-4 text-center max-w-xl">
          <Eye className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
          The Grad-CAM spatial heatmap highlights image regions that contributed most to the model&apos;s prediction of <b>{predictedSubtype}</b>.
        </p>
      </div>

    </div>
  );
};
