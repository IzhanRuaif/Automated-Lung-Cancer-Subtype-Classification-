import sys
import os

# Auto-resolve PYTHONPATH so both root and backend directory imports succeed
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_dir = os.path.dirname(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.session import engine, Base, SessionLocal
from app.models.models import User, Patient
from app.core.security import get_password_hash
from app.api import auth, patients, images, predictions, reports, chat

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

# Seed default doctor account if not present
db_session = SessionLocal()
doctor_user = db_session.query(User).filter(User.email == "doctor@hospital.org").first()
if not doctor_user:
    doctor_user = User(
        email="doctor@hospital.org",
        hashed_password=get_password_hash("doctor123"),
        full_name="Dr. Mohammed Izhan, MD",
        role="doctor"
    )
    db_session.add(doctor_user)
    db_session.commit()
    db_session.refresh(doctor_user)

# Auto-seed sample patient records if table is empty
if db_session.query(Patient).count() == 0:
    initial_patients = [
        {"patient_code": "P_1_1001", "full_name": "Eleanor Vance", "age": 64, "gender": "Female", "medical_history": "Non-smoker, persistent cough, right upper lobe nodule."},
        {"patient_code": "P_1_1002", "full_name": "Robert Sterling", "age": 71, "gender": "Male", "medical_history": "Former smoker (40 pack-years), central cavitary lung mass."},
        {"patient_code": "P_1_1003", "full_name": "Marcus Thorne", "age": 58, "gender": "Male", "medical_history": "Heavy smoker, hilar lymphadenopathy, rapid onset dyspnea."},
        {"patient_code": "P_1_1004", "full_name": "Clara Oswald", "age": 62, "gender": "Female", "medical_history": "Large peripheral pulmonary lesion with necrotic center."},
        {"patient_code": "PT-4028", "full_name": "Pavan Kumar", "age": 34, "gender": "Male", "medical_history": "Chain Smoker."},
        {"patient_code": "PID_0077", "full_name": "Suresh Raina", "age": 44, "gender": "Male", "medical_history": "Clinical observation."},
        {"patient_code": "PT-5341", "full_name": "Izhan", "age": 24, "gender": "Male", "medical_history": "Routine screening scan."},
        {"patient_code": "PT-6132", "full_name": "Salick", "age": 45, "gender": "Male", "medical_history": "Chest discomfort."},
        {"patient_code": "PT-3267", "full_name": "Rohit", "age": 58, "gender": "Male", "medical_history": "Annual health checkup."},
        {"patient_code": "PT-9988", "full_name": "MS Dhoni", "age": 44, "gender": "Male", "medical_history": "Follow-up scan."},
        {"patient_code": "PT-5992", "full_name": "Raj", "age": 44, "gender": "Male", "medical_history": "Subtype classification study."}
    ]
    for p_data in initial_patients:
        p = Patient(
            doctor_id=doctor_user.id if doctor_user else 1,
            patient_code=p_data["patient_code"],
            full_name=p_data["full_name"],
            age=p_data["age"],
            gender=p_data["gender"],
            medical_history=p_data["medical_history"]
        )
        db_session.add(p)
    db_session.commit()
db_session.close()

app = FastAPI(
    title="Automated Lung Cancer Subtype Classification REST API",
    description="AI decision-support system REST API for automated lung cancer subtype classification from CT scans.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files for Uploads and Grad-CAM Images
uploads_dir = os.path.abspath("data/uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=uploads_dir), name="static")

# Include Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(patients.router, prefix="/api/v1")
app.include_router(images.router, prefix="/api/v1")
app.include_router(predictions.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Automated Lung Cancer Subtype Classification REST API",
        "version": "1.0.0",
        "disclaimer": "AI decision-support research tool; not a medical diagnostic device."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
