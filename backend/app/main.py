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
from app.models.models import User
from app.core.security import get_password_hash
from app.api import auth, patients, images, predictions, reports

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
