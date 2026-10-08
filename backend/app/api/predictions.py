import json
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import CTImage, Prediction, Patient, User
from app.schemas.schemas import PredictionCreate, PredictionResponse
from app.services.ai_service import ai_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/predictions", tags=["Predictions & Grad-CAM"])

@router.post("", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
def create_prediction(
    payload: PredictionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ct_image = db.query(CTImage).filter(CTImage.id == payload.image_id).first()
    if not ct_image:
        raise HTTPException(status_code=404, detail="CT Image not found")

    patient = db.query(Patient).filter(Patient.id == ct_image.patient_id, Patient.doctor_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient metadata not found or unauthorized")

    # Execute Direct PyTorch AI Model Inference and Grad-CAM Engine
    try:
        res = ai_service.predict(
            image_path=ct_image.file_path,
            patient_code=patient.patient_code
        )
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))

    prediction = Prediction(
        image_id=ct_image.id,
        predicted_subtype=res["predicted_subtype"],
        confidence_score=res["confidence_score"],
        probabilities_json=json.dumps(res["probabilities"]),
        model_version=res["model_version"],
        gradcam_path=res["gradcam_path"]
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return PredictionResponse(
        id=prediction.id,
        image_id=prediction.image_id,
        predicted_subtype=prediction.predicted_subtype,
        confidence_score=prediction.confidence_score,
        probabilities=res["probabilities"],
        model_version=prediction.model_version,
        gradcam_url=f"/static/gradcam/{os.path.basename(prediction.gradcam_path)}" if prediction.gradcam_path else None,
        original_url=f"/static/{os.path.basename(ct_image.file_path)}" if ct_image else None,
        created_at=prediction.created_at
    )

@router.get("/{prediction_id}", response_model=PredictionResponse)
def get_prediction(
    prediction_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    ct_image = db.query(CTImage).filter(CTImage.id == prediction.image_id).first()
    patient = db.query(Patient).filter(Patient.id == ct_image.patient_id, Patient.doctor_id == current_user.id).first() if ct_image else None
    if not patient:
        raise HTTPException(status_code=404, detail="Prediction record not found or unauthorized")

    probs = json.loads(prediction.probabilities_json) if isinstance(prediction.probabilities_json, str) else prediction.probabilities_json
    return PredictionResponse(
        id=prediction.id,
        image_id=prediction.image_id,
        predicted_subtype=prediction.predicted_subtype,
        confidence_score=prediction.confidence_score,
        probabilities=probs,
        model_version=prediction.model_version,
        gradcam_url=f"/static/gradcam/{os.path.basename(prediction.gradcam_path)}" if prediction.gradcam_path else None,
        original_url=f"/static/{os.path.basename(ct_image.file_path)}" if ct_image else None,
        created_at=prediction.created_at
    )
