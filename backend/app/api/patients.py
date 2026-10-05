from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Patient
from app.schemas.schemas import PatientCreate, PatientResponse

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("", response_model=List[PatientResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    # Populate default research demo patients if empty
    if not patients and skip == 0:
        demo_patients = [
            Patient(patient_code="Lung_Dx-A0001", full_name="Eleanor Vance", age=64, gender="Female", medical_history="Non-smoker, persistent cough, right upper lobe nodule."),
            Patient(patient_code="Lung_Dx-G0012", full_name="Robert Sterling", age=71, gender="Male", medical_history="Former smoker (40 pack-years), central cavitary lung mass."),
            Patient(patient_code="Lung_Dx-B0005", full_name="Marcus Thorne", age=58, gender="Male", medical_history="Heavy smoker, hilar lymphadenopathy, rapid onset dyspnea."),
            Patient(patient_code="Lung_Dx-E0002", full_name="Clara Oswald", age=62, gender="Female", medical_history="Large peripheral pulmonary lesion with necrotic center.")
        ]
        for p in demo_patients:
            db.add(p)
        db.commit()
        patients = db.query(Patient).all()
    return patients

@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter(Patient.patient_code == patient.patient_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Patient code already registered")
    
    db_patient = Patient(
        patient_code=patient.patient_code,
        full_name=patient.full_name,
        age=patient.age,
        gender=patient.gender,
        medical_history=patient.medical_history
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, updated: PatientCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient.patient_code = updated.patient_code
    patient.full_name = updated.full_name
    patient.age = updated.age
    patient.gender = updated.gender
    patient.medical_history = updated.medical_history
    
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return None
