import React from 'react';
import { FileText, Download, Calendar, User } from 'lucide-react';
import { Report } from '../types';

interface ReportsPageProps {
  reports: Report[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ reports }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Analysis PDF Reports Archive</h2>
        <p className="text-xs text-slate-500">Access and download generated patient analysis reports</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {reports.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No PDF reports generated yet. Analyze a CT scan to generate a report.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Patient Analysis Report #{r.id}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{r.summary_text}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Generated on {new Date(r.generated_at).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <a
                href={r.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 flex items-center space-x-2 transition-colors"
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
