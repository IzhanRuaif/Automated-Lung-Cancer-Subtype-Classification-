import axios from 'axios';

const API_BASE_URL = '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (email: string, password: string, fullName: string, role: string = 'doctor') => {
    const res = await apiClient.post('/auth/register', { email, password, full_name: fullName, role });
    return res.data;
  },

  // Patients
  getPatients: async () => {
    const res = await apiClient.get('/patients');
    return res.data;
  },
  createPatient: async (patient: { patient_code: string; full_name: string; age: number; gender: string; medical_history?: string }) => {
    const res = await apiClient.post('/patients', patient);
    return res.data;
  },

  // CT Upload
  uploadCTImage: async (patientId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post(`/patients/${patientId}/ct-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Predictions
  predict: async (imageId: number) => {
    const res = await apiClient.post('/predictions', { image_id: imageId });
    return res.data;
  },
  getPrediction: async (predictionId: number) => {
    const res = await apiClient.get(`/predictions/${predictionId}`);
    return res.data;
  },

  // Reports
  createReport: async (predictionId: number) => {
    const res = await apiClient.post('/reports', null, { params: { prediction_id: predictionId } });
    return res.data;
  },
  getReports: async () => {
    const res = await apiClient.get('/reports');
    return res.data;
  },
};
