export interface User {
  email: string;
  name: string;
  role: string;
}

export interface Patient {
  id: number;
  patient_code: string;
  full_name: string;
  age: number;
  gender: string;
  medical_history?: string;
  created_at: string;
}

export interface CTImage {
  id: number;
  patient_id: number;
  filename: string;
  file_path: string;
  file_format: string;
  uploaded_at: string;
}

export interface Prediction {
  id: number;
  image_id: number;
  predicted_subtype: string;
  confidence_score: number;
  probabilities: Record<string, number>;
  model_version: string;
  gradcam_url?: string;
  original_url?: string;
  created_at: string;
}

export interface Report {
  id: number;
  patient_id: number;
  prediction_id: number;
  pdf_url: string;
  summary_text?: string;
  generated_at: string;
}
