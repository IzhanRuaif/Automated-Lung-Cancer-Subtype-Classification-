import React, { useState } from 'react';
import { UserPlus, Search, User, Filter, ArrowRight } from 'lucide-react';
import { Patient } from '../types';
import { api } from '../api/client';

interface PatientsPageProps {
  patients: Patient[];
  onRefresh: () => void;
  onSelectPatientForUpload: (patient: Patient) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({ patients, onRefresh, onSelectPatientForUpload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [patientCode, setPatientCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(60);
  const [gender, setGender] = useState('Male');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createPatient({
        patient_code: patientCode,
        full_name: fullName,
        age: Number(age),
        gender,
        medical_history: medicalHistory,
      });
      setShowModal(false);
      setPatientCode('');
      setFullName('');
      setMedicalHistory('');
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Patient Directory</h2>
          <p className="text-xs text-slate-400 font-medium">Manage patient records and associated CT imaging studies</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name or code..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Patient Code</th>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Age / Gender</th>
              <th className="py-3 px-4">Clinical History</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-600">{p.patient_code}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{p.full_name}</td>
                <td className="py-3.5 px-4 text-slate-600">{p.age} yrs, {p.gender}</td>
                <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">{p.medical_history || 'No prior history recorded'}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onSelectPatientForUpload(p)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-200 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>Upload CT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Create New Patient Record</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Patient Code (ID)</label>
                  <button
                    type="button"
                    onClick={() => setPatientCode(`PT-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Auto-Generate Random ID
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={patientCode}
                  onChange={(e) => setPatientCode(e.target.value)}
                  placeholder="e.g. PT-4092 or Lung_Dx-A0105"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    <option value="Male" className="text-slate-900 bg-white">Male</option>
                    <option value="Female" className="text-slate-900 bg-white">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Medical History / Clinical Notes</label>
                <textarea
                  rows={3}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Smoking history, symptoms, prior radiological findings..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow"
                >
                  {loading ? 'Saving...' : 'Save Patient Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
