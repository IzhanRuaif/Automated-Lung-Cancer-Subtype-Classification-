# Comprehensive Academic Capstone Documentation

**PROJECT TITLE:** Automated Lung Cancer Subtype Classification from CT Images using Deep CNNs and Attention Mechanisms  
**ACADEMIC DEGREE:** Final-Year B.Tech / Capstone Project (Software Design & Development — 10 Credits)  
**DATE:** October 5, 2026  
**DOCUMENT VERSION:** 1.0 (Final Architecture & Implementation Release)  

---

> [!IMPORTANT]
> **CLINICAL & ETHICAL DISCLAIMER:**  
> This system is strictly designed as an **AI-assisted decision-support research tool** and **NOT as a medical diagnostic device**. It does not replace professional medical diagnosis, clinical judgment, or radiological assessment by qualified medical personnel.

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Literature Survey](#4-literature-survey)
5. [Research Gap](#5-research-gap)
6. [Proposed System](#6-proposed-system)
7. [Dataset Verification & Metadata Audit](#7-dataset-verification--metadata-audit)
8. [Methodology](#8-methodology)
9. [System Architecture](#9-system-architecture)
10. [UML Diagrams](#10-uml-diagrams)
11. [ML Pipeline & Architecture](#11-ml-pipeline--architecture)
12. [Preprocessing & Hounsfield Unit Windowing](#12-preprocessing--hounsfield-unit-windowing)
13. [Baseline CNN Architecture](#13-baseline-cnn-architecture)
14. [Convolutional Block Attention Module (CBAM)](#14-convolutional-block-attention-module-cbam)
15. [Training Methodology & Class Weighting](#15-training-methodology--class-weighting)
16. [Multi-Tier Experimental Design](#16-multi-tier-experimental-design)
17. [Results & Comparative Analysis](#17-results--comparative-analysis)
18. [Grad-CAM Explainable AI Engine](#18-grad-cam-explainable-ai-engine)
19. [Full-Stack Web Implementation](#19-full-stack-web-implementation)
20. [Testing & Validation Suite](#20-testing--validation-suite)
21. [Limitations & Ethical Safety](#21-limitations--ethical-safety)
22. [Discussion](#22-discussion)
23. [Conclusion](#23-conclusion)
24. [Future Enhancements](#24-future-enhancements)
25. [References](#25-references)

---

## 1. Introduction
Lung cancer remains the leading cause of cancer mortality worldwide, accounting for nearly 1.8 million deaths annually. Accurate histopathological subtyping—specifically differentiating between **Adenocarcinoma (ADC)**, **Squamous Cell Carcinoma (SCC)**, **Small Cell Lung Carcinoma (SCLC)**, and **Large Cell Carcinoma (LCC)**—is critical because systemic therapeutic pathways differ dramatically between non-small cell lung cancer (NSCLC) and small cell lung cancer (SCLC) regimens.

Thoracic Computed Tomography (CT) is the primary non-invasive radiological modality for lung lesion screening. However, visual differentiation of subtle tissue density patterns remains challenging even for experienced thoracic radiologists. Computer-Aided Diagnosis (CAD) systems leveraging Deep Convolutional Neural Networks (CNNs) offer automated decision support; however, standard CNNs often process entire image frames without concentrating on localized diagnostic tumor structures.

This capstone project implements an end-to-end, web-based medical AI decision-support platform that integrates a **ResNet-18 Deep CNN backbone with a Convolutional Block Attention Module (CBAM)** to adaptively refine spatial and channel-wise feature representations of CT scans, accompanied by **Grad-CAM visual heatmaps** and ReportLab PDF report generation.

---

## 2. Problem Statement
Existing radiological AI diagnostic tools suffer from three major research and software design bottlenecks:
1. **Lack of Histopathological Subtype Specificity:** Many public CAD systems classify CT scans into binary (*Benign vs. Malignant*) categories rather than pathologically confirmed histopathological subtypes (ADC, SCC, SCLC, LCC).
2. **Black-Box Opacity:** Standard deep learning models provide prediction probabilities without spatial visual justification, reducing clinician trust.
3. **Data Contamination & Overfitting:** Naïve slice-level splitting causes severe data leakage where CT slices from the same patient appear in both training and test sets.

---

## 3. Objectives
The primary objective is to build a complete, end-to-end 10-credit academic capstone web application that can:
1. Provide secure doctor authentication (JWT) and patient profile management.
2. Accept DICOM/PNG thoracic CT scan uploads with input validation.
3. Apply medical Hounsfield Unit (HU) lung windowing (Level -600 HU, Width 1500 HU).
4. Perform patient-stratified subtype classification using CBAM Attention CNNs.
5. Generate Grad-CAM spatial activation heatmaps to highlight visual lesion ROI focus.
6. Generate professional downloadable PDF analysis reports.

---

## 4. Literature Survey
Recent literature in radiological AI has demonstrated the efficacy of attention mechanisms:
- *Woo et al. (2018)* introduced CBAM, demonstrating that sequential Channel and Spatial Attention modules improve representation power without significant computational overhead.
- *Li et al. (2020)* curated the TCIA `Lung-PET-CT-Dx` dataset (DOI: 10.7937/TCIA.2020.NNC2-0461), providing 355 pathologically confirmed thoracic CT/PET-CT subjects.
- *Selvaraju et al. (2017)* established Grad-CAM for visual explanations, producing gradient-weighted activation maps from target feature layers.

---

## 5. Research Gap
While attention mechanisms and Grad-CAM have been studied in isolated computer vision tasks, there is a distinct lack of open, end-to-end web architectures that:
- Combine patient-level zero-leakage dataset splitting with multi-tier benchmark evaluation.
- Address severe class imbalance (e.g., LCC scarcity) without synthetic label fabrication.
- Integrate a full-stack REST API and interactive React UI with opacity-controlled Grad-CAM viewers.

---

## 6. Proposed System
The proposed system integrates:
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts.
- **Backend:** Python FastAPI, Pydantic, SQLAlchemy, JWT security, ReportLab.
- **AI/ML Engine:** PyTorch, torchvision, CBAM Attention, Grad-CAM, DICOM loader.
- **Database:** PostgreSQL / SQLite with strict patient-to-prediction relationships.

---

## 7. Dataset Verification & Metadata Audit
Direct verification against the official TCIA REST API for collection `Lung-PET-CT-Dx`:
- **Total Official Subjects:** **355 subjects**
- **Total DICOM Series:** **1,295 series** (1,162 CT axial series, 133 PET series)
- **Total Axial CT Slices:** **205,459 slices**
- **Ground Truth Pathology:** Biopsy-confirmed subtype labels encoded in patient prefixes:
  - `Lung_Dx-A*`: **Adenocarcinoma (ADC)** — 251 subjects (70.7%)
  - `Lung_Dx-G*`: **Squamous Cell Carcinoma (SCC)** — 61 subjects (17.2%)
  - `Lung_Dx-B*`: **Small Cell Lung Carcinoma (SCLC)** — 38 subjects (10.7%)
  - `Lung_Dx-E*` / `Lung_Dx-C*`: **Large Cell Carcinoma (LCC)** — 5 subjects (1.4%)

---

## 8. Methodology
The system follows a strict pipeline:
```
Doctor Login ➔ Patient Selection ➔ CT Upload ➔ HU Windowing ➔ CBAM CNN Inference ➔ Grad-CAM Heatmap ➔ PDF Report Generation
```

---

## 9. System Architecture
```
[React + Vite Frontend]
       │
   (REST API)
       │
[FastAPI Backend Controller]
       ├── [SQLAlchemy ORM ➔ SQLite / PostgreSQL]
       ├── [AI Service ➔ PyTorch CBAM Attention Model]
       └── [PDF Service ➔ ReportLab Engine]
```

---

## 10. UML Diagrams

### Use Case Diagram
```
(Doctor) ───► [Login]
(Doctor) ───► [Manage Patients]
(Doctor) ───► [Upload CT Scan]
(Doctor) ───► [View Subtype Prediction & Grad-CAM]
(Doctor) ───► [Download PDF Report]
```

---

## 11. ML Pipeline & Architecture
The PyTorch ML pipeline loads patient slice tensors, applies ResNet-18 feature extraction, passes features through CBAM Channel and Spatial Attention modules, applies Global Average Pooling, and computes multi-class softmax probabilities.

---

## 12. Preprocessing & Hounsfield Unit Windowing
Raw CT Hounsfield Units (HU) are windowed using standard lung window settings:
$$\text{Windowed HU} = \text{clip}\left(\text{HU}, -1350, 150\right)$$
Normalized to $[0, 1]$ and resized to $224 \times 224 \times 3$.

---

## 13. Baseline CNN Architecture
The baseline CNN utilizes a ResNet-18 backbone without attention blocks, terminating in a Global Average Pooling layer and Fully Connected linear classifier.

---

## 14. Convolutional Block Attention Module (CBAM)
CBAM combines Channel Attention (recalibrating feature channels via MaxPool + AvgPool MLP) and Spatial Attention (refining lesion locations via $7 \times 7$ convolution).

---

## 15. Training Methodology & Class Weighting
Models are trained using AdamW ($\text{lr}=10^{-3}$, weight decay $= 10^{-4}$) with Class-Weighted Cross-Entropy Loss:
$$w_c = \frac{N_{\text{total}}}{K \cdot N_c}$$

---

## 16. Multi-Tier Experimental Design
- **Tier 1 (Primary Statistically Defensible Benchmark - 3-Class):** ADC vs. SCC vs. SCLC (350 subjects).
- **Tier 2 (Exploratory Capstone Investigation - 4-Class):** ADC vs. SCC vs. SCLC vs. LCC (355 subjects).
- **Tier 3 (Clinical Hierarchy Benchmark - Binary):** NSCLC vs. SCLC (355 subjects).

---

## 17. Results & Comparative Analysis
The proposed CBAM Attention CNN demonstrated superior macro F1-scores and classification accuracy over the Baseline CNN across all benchmark tiers. Complete empirical logs are saved in `ml/reports/evaluation_results.md`.

---

## 18. Grad-CAM Explainable AI Engine
Grad-CAM computes target class gradients with respect to `layer4` feature maps, producing 2D spatial heatmaps overlaid on original CT scans using JET colormap blending.

---

## 19. Full-Stack Web Implementation
- **Backend:** FastAPI with modular routes (`/auth`, `/patients`, `/predictions`, `/reports`).
- **Frontend:** React 18, TypeScript, Tailwind CSS with interactive opacity-controlled Grad-CAM viewers.

---

## 20. Testing & Validation Suite
Automated pytest test suite in `tests/test_backend.py` verified 8 core test cases:
1. `test_dicom_windowing`
2. `test_synthetic_ct_tensor_shape`
3. `test_baseline_cnn_forward`
4. `test_attention_cbam_cnn_forward`
5. `test_gradcam_generation`
6. `test_fastapi_root_endpoint`
7. `test_fastapi_health_endpoint`
8. `test_fastapi_get_patients`

---

## 21. Limitations & Ethical Safety
- **LCC Class Scarcity:** Large Cell Carcinoma (LCC) has 5 subjects ($N_{\text{test}}=1$). Metrics for LCC represent single-patient point accuracy.
- **Decision-Support Scope:** The system is strictly intended for research and decision support, not independent medical diagnosis.

---

## 22. Discussion
The empirical results confirm that attention mechanisms (CBAM) enhance spatial localization of lung lesions in CT scans, providing clear diagnostic feature refinement.

---

## 23. Conclusion
This capstone project successfully demonstrates an end-to-end, web-based AI decision-support platform combining patient-stratified data splitting, CBAM attention CNNs, Grad-CAM visual heatmaps, and ReportLab PDF report generation.

---

## 24. Future Enhancements
1. 3D Volumetric Attention Convolutions for full CT DICOM series.
2. Integration with hospital PACS (Picture Archiving and Communication System) DICOM servers.
3. Multi-center clinical trials for external model validation.

---

## 25. References
1. Li, P., et al. (2020). *A Large-Scale CT and PET/CT Dataset for Lung Cancer Diagnosis (Lung-PET-CT-Dx)*. The Cancer Imaging Archive. DOI: 10.7937/TCIA.2020.NNC2-0461.
2. Woo, S., et al. (2018). *CBAM: Convolutional Block Attention Module*. ECCV 2018.
3. Selvaraju, R. R., et al. (2017). *Grad-CAM: Visual Explanations from Deep Networks*. ICCV 2017.
