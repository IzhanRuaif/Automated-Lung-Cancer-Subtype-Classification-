from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_email: str
    user_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Patient Schemas
class PatientBase(BaseModel):
    patient_code: str
    full_name: str
    age: int
    gender: str
    medical_history: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# CT Image Schemas
class CTImageResponse(BaseModel):
    id: int
    patient_id: int
    filename: str
    file_path: str
    file_format: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Prediction Schemas
class PredictionCreate(BaseModel):
    image_id: int

class PredictionResponse(BaseModel):
    id: int
    image_id: int
    predicted_subtype: str
    confidence_score: float
    probabilities: Dict[str, float]
    model_version: str
    gradcam_url: Optional[str] = None
    original_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Report Schemas
class ReportResponse(BaseModel):
    id: int
    patient_id: int
    prediction_id: int
    pdf_url: str
    summary_text: Optional[str] = None
    generated_at: datetime

    class Config:
        from_attributes = True
