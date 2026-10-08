# Automated Lung Cancer Subtype Classification from CT Images using Deep CNNs and Attention Mechanisms

An academic AI-assisted decision-support research platform for automated lung cancer histopathological subtype classification from thoracic CT scans using Deep Convolutional Neural Networks (CNNs), Channel & Spatial Attention (CBAM), and Grad-CAM visual explanation heatmaps.

> [!IMPORTANT]
> **MEDICAL DISCLAIMER**  
> This system is designed strictly as an **AI-assisted decision-support research tool** and **NOT as a medical diagnostic device**. It does not replace professional medical diagnosis, clinical judgment, or radiological assessment by qualified medical personnel.

---

## 🌟 Key Platform Features

* 🧬 **Multi-Tier Histopathological Subtype Classification**: Classifies thoracic CT scans into primary lung cancer subtypes:
  * **Adenocarcinoma (ADC)**
  * **Squamous Cell Carcinoma (SCC)**
  * **Small Cell Lung Carcinoma (SCLC)**
  * **Large Cell Carcinoma (LCC)**
* 🧠 **Convolutional Block Attention Module (CBAM)**: Integrates sequential channel and spatial attention mechanisms into standard CNN backbones (ResNet-18/50) to focus feature extraction on subtle pulmonary nodule patterns.
* 👁️ **Explainable AI (Grad-CAM)**: Generates visual heatmap overlays highlighting specific anatomical regions driving the model's subtype predictions.
* ⚡ **FastAPI REST API Backend**: High-performance async Python backend supporting JWT authentication, patient history management, DICOM windowing, and SQLite/PostgreSQL databases.
* 💻 **Modern Clinical UI**: React 18 + TypeScript + Vite + Tailwind CSS dashboard with responsive charts, scan previews, and interactive diagnostic displays.
* 📄 **Automated PDF Clinical Reports**: Generates downloadable, professional radiological PDF reports containing patient metadata, confidence breakdowns, and Grad-CAM visual heatmaps via ReportLab.
* 🐳 **Complete Docker Orchestration**: One-command containerized setup orchestrating PostgreSQL, FastAPI, and Nginx/React services via Docker Compose.

---

## 📁 Project Architecture

```
lung-cancer-subtype-classification/
├── frontend/             # React 18 + TypeScript + Vite + Tailwind CSS User Interface
│   ├── src/              # React components, API client, pages & types
│   ├── package.json      # Frontend npm dependencies
│   └── vite.config.ts    # Vite dev server & proxy settings
├── backend/              # FastAPI REST API + SQLAlchemy + JWT Authentication
│   ├── app/              # Main API endpoints, security, schemas & database sessions
│   ├── Dockerfile        # Container setup for FastAPI backend
│   └── requirements.txt  # Python backend dependencies
├── ml/                   # Machine Learning Engine
│   ├── models/           # Baseline CNN & CBAM Attention CNN architectures & trained .pth weights
│   ├── preprocessing/    # DICOM loader & Hounsfield Unit (HU) windowing functions
│   ├── explainability/   # Grad-CAM heatmap generation engine
│   ├── reports/          # Experimental markdown benchmarks & Grad-CAM visual samples
│   ├── train.py          # Multi-tier training & evaluation execution script
│   └── evaluate.py       # Benchmark evaluation script
├── data/                 # Raw/Processed CT images & manifest metadata
│   ├── metadata/         # TCIA dataset manifests & patient-level split JSONs
│   └── uploads/          # Static uploaded CT scans & generated Grad-CAM heatmaps
├── database/             # PostgreSQL database schemas
├── tests/                # Automated pytest & API test suite (19 passing tests)
├── docs/                 # Documentation & dataset verification reports (docs/dataset.md)
├── scripts/              # Dataset metadata parsing, DICOM inspection & split scripts
├── reports/              # Generated ML validation plots and PDF reports
├── docker-compose.yml    # Docker Compose multi-container orchestration
├── create_presentation.py # Automated PowerPoint presentation deck generator
├── lung_cancer_db.sqlite3 # Local SQLite database
└── README.md             # Project documentation
```

---

## 🔬 Intended Clinical & Technical Workflow

```
Doctor / Medical Researcher
 ↓
Web Application (React 18 + Vite UI)
 ↓
Authentication (JWT OAuth2)
 ↓
Patient Profile Management
 ↓
Thoracic CT Scan Upload (DICOM / PNG / JPG)
 ↓
FastAPI Backend REST API
 ↓
CT Preprocessing (Hounsfield Unit Windowing: L=-600, W=1500, Resizing & Normalization)
 ↓
Deep CNN Backbone + CBAM Attention Mechanism Forward Pass
 ↓
Subtype Classification Probabilities (ADC / SCC / SCLC / LCC)
 ↓
Grad-CAM Visual Explanation Engine (Heatmap Generation & Overlay)
 ↓
Professional PDF Report Generation (ReportLab)
 ↓
Patient History & Database Archival (PostgreSQL / SQLite)
```

---

## 🚀 How to Run the Project

### Option A: Local Development Setup (Quickest)

#### Prerequisites
* **Python 3.10+**
* **Node.js v18+** & **npm**

#### 1. Start FastAPI Backend REST API
Open a terminal in the root directory:

```bash
# Install backend Python dependencies
pip install -r backend/requirements.txt

# Launch FastAPI server with auto-reload
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```
* **API Server:** `http://127.0.0.1:8000`
* **Swagger API Documentation:** `http://127.0.0.1:8000/docs`
* **Default Seeding Credentials:**
  * **Email:** `doctor@hospital.org`
  * **Password:** `doctor123`

#### 2. Start React Frontend Web Application
Open a **second terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```
* **Frontend Web App:** `http://localhost:3000`

---

### Option B: Containerized Run with Docker Compose

Ensure **Docker Desktop** is running on your machine, then run:

```bash
# Navigate to project root directory
cd lung-cancer-subtype-classification

# Build and launch PostgreSQL, FastAPI Backend, and Nginx/React Frontend containers
docker compose up --build
```
* **Web Application:** `http://localhost:3000`
* **Backend API:** `http://localhost:8000`

---

## 📊 Model Training & Benchmarking

To train the Baseline CNN and proposed CBAM Attention CNN from scratch across 3-class, 4-class, and binary tiers:

```bash
python ml/train.py
```

### Comparative Benchmark Summary (Tier 1: 3-Class Primary)

| Model Architecture | Accuracy | Precision (Macro) | Recall (Macro) | F1-Score (Macro) |
|---|---|---|---|---|
| **Baseline CNN (ResNet-18)** | 88.20% | 87.50% | 88.00% | 87.70% |
| **Proposed Attention CNN (CBAM ResNet-18)** | **94.80%** | **94.60%** | **94.80%** | **94.70%** |

*For full experimental design and patient-level splitting details, refer to [`ml/reports/evaluation_results.md`](ml/reports/evaluation_results.md).*

---

## 🧪 Automated Testing

Run the automated `pytest` suite covering API endpoints, model forward passes, DICOM loading, and Grad-CAM generation:

```bash
python -m pytest
```

---

## 📊 Dataset Reference & Citation

This project utilizes the pathologically confirmed **TCIA `Lung-PET-CT-Dx`** dataset (*Li et al., 2020*, DOI: [`10.7937/TCIA.2020.NNC2-0461`](https://doi.org/10.7937/TCIA.2020.NNC2-0461)).

For full dataset verification, metadata audit, and patient-level splitting documentation, see [`docs/dataset.md`](docs/dataset.md).

---

## 📜 License

Academic & Educational Capstone Research Project. Data subject to TCIA CC BY 4.0 license.
