import React from 'react';
import { FileText, Download, Calendar, ShieldCheck } from 'lucide-react';
import { Report } from '../types';

interface ReportsPageProps {
  reports: Report[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ reports }) => {
  return (
    <div className="space-y-6 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Analysis PDF Reports Archive</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">Access and download generated patient analysis reports</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200 text-xs font-semibold text-blue-800">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Total PDF Reports: {reports.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-mono">
            No PDF reports generated yet. Analyze a CT scan slice to generate an automated report.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Patient Analysis Report #{r.id}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{r.summary_text}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Generated on {new Date(r.generated_at).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <a
                href={r.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
