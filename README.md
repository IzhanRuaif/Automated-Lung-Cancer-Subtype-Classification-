# Automated Lung Cancer Subtype Classification from CT Images using Deep CNNs and Attention Mechanisms

An academic AI-assisted decision-support research platform for automated lung cancer histopathological subtype classification from thoracic CT scans using Deep Convolutional Neural Networks (CNNs), Channel & Spatial Attention (CBAM), and Grad-CAM visual explanation heatmaps.

> **IMPORTANT DISCLAIMER**  
> This system is designed strictly as an **AI-assisted decision-support research tool** and **NOT as a medical diagnostic device**. It does not replace professional medical diagnosis, clinical judgement, or radiological assessment by qualified medical personnel.

---

## Project Architecture

```
lung-cancer-subtype-classification/
├── frontend/             # React 18 + TypeScript + Vite + Tailwind CSS User Interface
├── backend/              # FastAPI REST API + SQLAlchemy + JWT Authentication
├── ml/                   # PyTorch models, CBAM Attention, Preprocessing, Grad-CAM Engine
├── data/                 # Raw/Processed CT images & manifest metadata (gitignored)
├── database/             # PostgreSQL database schemas
├── tests/                # Automated pytest & API test suite
├── docs/                 # Documentation & dataset reports (docs/dataset.md)
├── docker/               # Container configuration files
├── scripts/              # Dataset metadata parsing, EDA & patient-level split scripts
├── reports/              # Generated ML validation plots and PDF reports
├── README.md             # Project documentation
└── docker-compose.yml    # Docker service orchestration
```

---

## Intended Clinical & Technical Workflow

```
Doctor / Medical Researcher
 ↓
Web Application (React + Vite UI)
 ↓
Authentication (JWT OAuth2)
 ↓
Patient Profile Management
 ↓
Thoracic CT Scan Upload (DICOM / PNG)
 ↓
FastAPI Backend REST API
 ↓
CT Preprocessing (HU Windowing, Resizing, Normalization)
 ↓
Deep CNN Backbone + CBAM Attention Mechanism
 ↓
Subtype Classification Probabilities (ADC / SCC / SCLC / LCC)
 ↓
Grad-CAM Visual Explanation Engine (Heatmap Overlay)
 ↓
Professional PDF Report Generation (ReportLab)
 ↓
Patient History & Database Archival (PostgreSQL)
```

---

## Dataset

This project utilizes the pathologically confirmed **TCIA `Lung-PET-CT-Dx`** dataset (*Li et al., 2020*, DOI: [`10.7937/TCIA.2020.NNC2-0461`](https://doi.org/10.7937/TCIA.2020.NNC2-0461)).
For full dataset verification, metadata audit, and patient-level splitting documentation, see [`docs/dataset.md`](docs/dataset.md).

---

## License

Academic & Educational Research Project. Data subject to TCIA CC BY 4.0 license.
