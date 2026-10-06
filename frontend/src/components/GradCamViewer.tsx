import React, { useState } from 'react';
import { Layers, Sliders, ZoomIn, ZoomOut, RotateCcw, Eye, Sun, Activity, ShieldCheck, Crosshair, Cpu } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side' | 'original' | 'heatmap'>('overlay');
  const [opacity, setOpacity] = useState<number>(0.65);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1.0);
    setIsInverted(false);
    setHighContrast(false);
    setOpacity(0.65);
  };

  const imageStyle: React.CSSProperties = {
    transform: `scale(${zoom})`,
    filter: `${isInverted ? 'invert(100%)' : ''} ${highContrast ? 'contrast(160%) brightness(110%)' : ''}`.trim(),
    transition: 'transform 0.15s ease-out, filter 0.2s ease',
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      
      {/* PACS Viewport Header Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Status HUD */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold tracking-wide">
            <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="uppercase text-[11px] font-mono">PACS Diagnostic Viewport</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-mono text-[10px]">Slice Res: 224×224</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 font-mono text-[10px]">HU Window: [-1350, +150]</span>
        </div>

        {/* Center Viewport Switcher */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'overlay' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'side-by-side' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'original' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original CT
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'heatmap' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Attention Heatmap
          </button>
        </div>

        {/* Right Tools Controls */}
        <div className="flex items-center space-x-2">
          {viewMode === 'overlay' && (
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-[11px]">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-mono">Opacity: {(opacity * 100).toFixed(0)}%</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {/* Zoom & Preset Controls */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-1 rounded-lg transition-colors ${highContrast ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-amber-400'}`}
              title="Toggle High Contrast Preset"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleReset}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Viewport Canvas Monitor Container */}
      <div className="p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden select-none">
        
        {/* Subtle PACS Grid lines overlay */}
        <div className="absolute inset-0 medical-grid-bg opacity-30 pointer-events-none"></div>

        {/* HUD Corner Text */}
        <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500 leading-tight pointer-events-none z-10">
          <p className="text-cyan-400 font-bold">DISCIPLINE: THORACIC ONCOLOGY</p>
          <p>BACKBONE: ResNet-18 + CBAM</p>
          <p>TARGET LAYER: layer4.1.conv2</p>
        </div>

        <div className="absolute top-4 right-4 font-mono text-[10px] text-slate-500 text-right leading-tight pointer-events-none z-10">
          <p className="text-emerald-400 font-bold">PREDICTION: {predictedSubtype}</p>
          <p>CONFIDENCE: {(confidenceScore * 100).toFixed(1)}%</p>
          <p>ZOOM: {(zoom * 100).toFixed(0)}%</p>
        </div>

        {/* OVERLAY VIEW */}
        {viewMode === 'overlay' && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl max-w-sm w-full bg-black">
            <img
              src={originalUrl || '/static/gradcam/sample_ct.png'}
              alt="Original CT Scan"
              style={imageStyle}
              className="w-full h-auto object-cover block"
            />
            {gradcamUrl && (
              <img
                src={gradcamUrl}
                alt="Grad-CAM Spatial Heatmap"
                style={{ ...imageStyle, opacity }}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 pointer-events-none mix-blend-screen"
              />
            )}
          </div>
        )}

        {/* SIDE BY SIDE VIEW */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">Input CT Slice (Axial)</span>
                <span className="text-[10px] text-slate-500 font-mono">DICOM Float32</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center min-h-[260px]">
                <img
                  src={originalUrl || '/static/gradcam/sample_ct.png'}
                  alt="Original CT"
                  style={imageStyle}
                  className="max-h-72 w-full object-contain"
                />
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Grad-CAM Spatial Heatmap</span>
                <span className="text-[10px] text-cyan-500/80 font-mono">Layer 4 Attention</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center min-h-[260px]">
                <img
                  src={gradcamUrl || '/static/gradcam/sample_ct.png'}
                  alt="Grad-CAM Heatmap"
                  style={imageStyle}
                  className="max-h-72 w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* ORIGINAL ONLY */}
        {viewMode === 'original' && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl max-w-sm w-full bg-black z-10">
            <img
              src={originalUrl || '/static/gradcam/sample_ct.png'}
              alt="Original CT Scan"
              style={imageStyle}
              className="w-full h-auto object-cover block"
            />
          </div>
        )}

        {/* HEATMAP ONLY */}
        {viewMode === 'heatmap' && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl max-w-sm w-full bg-black z-10">
            <img
              src={gradcamUrl || '/static/gradcam/sample_ct.png'}
              alt="Grad-CAM Heatmap"
              style={imageStyle}
              className="w-full h-auto object-cover block"
            />
          </div>
        )}

        {/* Explanatory Caption Footer */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 z-10 max-w-2xl text-center">
          <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Grad-CAM visualizes spatial activations in <b>layer4.1.conv2</b>. Warm red regions indicate high feature saliency for <b>{predictedSubtype}</b>.
          </span>
        </div>

      </div>

    </div>
  );
};
