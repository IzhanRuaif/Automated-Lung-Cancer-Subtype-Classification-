import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Patient, CTImage, User
from app.schemas.schemas import CTImageResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/patients", tags=["CT Upload"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".dcm", ".dcm.gz"}
MAX_FILE_SIZE_MB = 50

@router.post("/{patient_id}/ct-upload", response_model=CTImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_ct_image(
    patient_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    patient = db.query(Patient).filter(Patient.id == patient_id, Patient.doctor_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or unauthorized")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    upload_dir = os.path.abspath("data/uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    saved_filename = f"doc_{current_user.id}_pt_{patient.id}_{file.filename}"
    file_path = os.path.join(upload_dir, saved_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ct_image = CTImage(
        patient_id=patient.id,
        filename=file.filename,
        file_path=file_path,
        file_format=ext.replace(".", "").upper()
    )
    db.add(ct_image)
    db.commit()
    db.refresh(ct_image)

    return ct_image
