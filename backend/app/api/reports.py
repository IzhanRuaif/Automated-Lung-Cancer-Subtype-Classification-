import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Patient, Prediction, Report
from app.schemas.schemas import ReportResponse
from app.services.pdf_service import generate_pdf_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(prediction_id: int, db: Session = Depends(get_db)):
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    ct_image = prediction.image
    patient = ct_image.patient if ct_image else None
    if not patient:
        raise HTTPException(status_code=404, detail="Patient metadata missing for prediction")

    os.makedirs("reports", exist_ok=True)
    pdf_filename = f"report_pt_{patient.patient_code}_pred_{prediction.id}.pdf"
    pdf_path = os.path.abspath(os.path.join("reports", pdf_filename))

    generate_pdf_report(
        patient=patient,
        prediction=prediction,
        ct_image_path=ct_image.file_path,
        gradcam_path=prediction.gradcam_path,
        output_pdf_path=pdf_path
    )

    report = Report(
        patient_id=patient.id,
        prediction_id=prediction.id,
        pdf_path=pdf_path,
        summary_text=f"AI-assisted classification report for patient {patient.patient_code}. Predicted Subtype: {prediction.predicted_subtype} ({prediction.confidence_score*100:.1f}% confidence)."
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ReportResponse(
        id=report.id,
        patient_id=report.patient_id,
        prediction_id=report.prediction_id,
        pdf_url=f"/api/v1/reports/{report.id}/download",
        summary_text=report.summary_text,
        generated_at=report.generated_at
    )

@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="PDF Report file not found")
    
    return FileResponse(
        path=report.pdf_path,
        filename=os.path.basename(report.pdf_path),
        media_type="application/pdf"
    )

@router.get("", response_model=List[ReportResponse])
def get_reports(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    reports = db.query(Report).offset(skip).limit(limit).all()
    out = []
    for r in reports:
        out.append(ReportResponse(
            id=r.id,
            patient_id=r.patient_id,
            prediction_id=r.prediction_id,
            pdf_url=f"/api/v1/reports/{r.id}/download",
            summary_text=r.summary_text,
            generated_at=r.generated_at
        ))
    return out
