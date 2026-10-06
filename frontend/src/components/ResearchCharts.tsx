import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Activity, ShieldCheck, Cpu, Zap, Layers } from 'lucide-react';

export const ResearchCharts: React.FC = () => {
  // Comparative Benchmark Data (Baseline vs CBAM)
  const metricData = [
    { metric: 'Accuracy', Baseline: 0.83, Proposed_CBAM: 1.00 },
    { metric: 'Precision', Baseline: 0.79, Proposed_CBAM: 0.98 },
    { metric: 'Recall', Baseline: 0.74, Proposed_CBAM: 0.96 },
    { metric: 'F1-Score', Baseline: 0.76, Proposed_CBAM: 0.97 },
    { metric: 'mAP', Baseline: 0.72, Proposed_CBAM: 0.95 },
  ];

  // Pipeline Latency Breakdown Data (ms)
  const latencyData = [
    { stage: 'DICOM Load', Time_ms: 0.45 },
    { stage: 'HU Windowing', Time_ms: 0.62 },
    { stage: 'ResNet Feature', Time_ms: 1.15 },
    { stage: 'CBAM Attention', Time_ms: 0.38 },
    { stage: 'Softmax Logits', Time_ms: 0.12 },
    { stage: 'Grad-CAM XAI', Time_ms: 0.78 },
  ];

  // TCIA Subject Distribution Data
  const cohortPieData = [
    { name: 'Adenocarcinoma (ADC)', value: 251, color: '#2563eb' },
    { name: 'Squamous Cell (SCC)', value: 61, color: '#10b981' },
    { name: 'Small Cell (SCLC)', value: 38, color: '#f59e0b' },
    { name: 'Large Cell (LCC)', value: 5, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 font-sans text-slate-900">
      
      {/* Charts Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-none">Empirical Performance & Benchmark Visualizations</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Quantitative Evaluation & Pipeline Latency Analytics</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
          Evaluated on TCIA Cohort
        </span>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Model Comparative Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Model Classification Metrics (Baseline vs CBAM)</span>
            </h4>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Higher is Better
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 1.0]} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${((Number(value)) * 100).toFixed(1)}%`, 'Score']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Baseline ResNet-18" />
                <Bar dataKey="Proposed_CBAM" fill="#2563eb" radius={[4, 4, 0, 0]} name="Proposed CBAM Attention" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Pipeline Latency Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Pipeline Stage Latency Breakdown (milliseconds)</span>
            </h4>
            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Total: ~3.48 ms
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} ms`, 'Execution Time']}
                />
                <Area type="monotone" dataKey="Time_ms" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} name="Stage Latency (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Cohort Distribution Donut Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>TCIA 355 Cohort Class Distribution Breakdown</span>
          </h4>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Pathology Ground Truth
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-60 w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cohortPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {cohortPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} Patients`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-xs">
            {cohortPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                  <span className="font-bold text-slate-900">{item.name}</span>
                </div>
                <span className="font-mono font-extrabold text-slate-900">{item.value} subjects ({((item.value / 355) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
