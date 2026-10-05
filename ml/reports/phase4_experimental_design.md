# Phase 4 Experimental Design & Academic Research Methodology

**Project Title:** Automated Lung Cancer Subtype Classification from CT Images using Deep CNNs and Attention Mechanisms  
**Target Standard:** 10-Credit Final-Year Academic Capstone (Software Design & Development)  
**Document Version:** 1.0 (Phase 4 Proposed Plan)  
**Date:** September 22, 2026  

---

## 1. Executive Summary & Academic Objectives

This document establishes the formal, academically rigorous experimental methodology for evaluating Deep Convolutional Neural Networks (CNNs) and Attention Mechanisms (CBAM) for lung cancer histopathological subtype classification from CT images.

To meet the quality and rigor expected of a **10-credit academic capstone project**, all experimental steps prioritize:
1. **Zero Data Leakage:** Strict patient-level stratification (no slice-level cross-validation contamination).
2. **Empirical Groundedness:** 100% real experimental metrics from model execution; zero fabricated or synthetic data.
3. **Multi-Tier Experimental Design:** Evaluating 3-class primary benchmarks, 4-class capstone exploration, and binary NSCLC vs. SCLC clinical hierarchy.
4. **Explainability & Verification:** Grad-CAM visual heatmaps paired with confusion matrices, per-class F1-scores, and ROC-AUC curves.

---

## 2. Dataset Verification & Leakage Audit Summary

### 2.1 Metadata Audit Results (355 Official Subjects)
- **Source Repository:** TCIA `Lung-PET-CT-Dx` (DOI: `10.7937/TCIA.2020.NNC2-0461`)
- **Total Subjects:** **355 subjects** (100% pathologically verified in official metadata)
- **Total DICOM Series:** **1,295 series** (1,162 CT axial series, 133 PET series)
- **Total Usable Axial CT Slices:** **205,459 slices**
- **Scanner Breakdown:** Siemens (806 series), GE Medical Systems (370 series), Philips (119 series)

### 2.2 Verified Subtype Distribution
| Histopathological Subtype | Subject ID Prefix | Total Patients | Cohort % | Total Axial CT Slices |
|---|---|---|---|---|
| **Adenocarcinoma (ADC)** | `Lung_Dx-A*` | **251** | 70.7% | 150,552 |
| **Squamous Cell Carcinoma (SCC)** | `Lung_Dx-G*` | **61** | 17.2% | 39,666 |
| **Small Cell Lung Carcinoma (SCLC)** | `Lung_Dx-B*` | **38** | 10.7% | 14,433 |
| **Large Cell Carcinoma (LCC)** | `Lung_Dx-E*` / `Lung_Dx-C*` | **5** | **1.4%** | **808** |
| **Total** | | **355** | **100.0%** | **205,459** |

### 2.3 Verified Zero Patient-Level Leakage Split (Seed 42)
| Subtype | Train Patients (70%) | Val Patients (15%) | Test Patients (15%) | Total Usable |
|---|---|---|---|---|
| **Adenocarcinoma (ADC)** | 176 | 38 | 37 | 251 |
| **Squamous Cell Carcinoma (SCC)** | 43 | 9 | 9 | 61 |
| **Small Cell Lung Carcinoma (SCLC)** | 27 | 6 | 5 | 38 |
| **Large Cell Carcinoma (LCC)** | 3 | 1 | 1 | 5 |
| **Total Split Patients** | **249** | **54** | **52** | **355** |

- **Leakage Verification:**  
  $$\text{Train} \cap \text{Val} = \emptyset, \quad \text{Train} \cap \text{Test} = \emptyset, \quad \text{Val} \cap \text{Test} = \emptyset$$  
  Empirically verified in `scripts/inspect_dicom_metadata.py`. Zero patient leakage exists.

---

## 3. Multi-Tier Experimental Benchmark Framework

To address the severe minority representation of Large Cell Carcinoma (LCC = 5 subjects) while preserving full research integrity, we introduce a **3-Tiered Benchmark Framework**:

```
                                  TCIA Lung-PET-CT-Dx Dataset (355 Subjects)
                                                       │
         ┌─────────────────────────────────────────────┼─────────────────────────────────────────────┐
         ▼                                             ▼                                             ▼
  TIER 1: Primary Benchmark               TIER 2: Capstone Exploration                   TIER 3: Clinical Hierarchy
 3-Class Multiclass Schema                 4-Class Full Schema                           2-Class Binary Schema
(ADC vs SCC vs SCLC - 350 subjects)      (ADC vs SCC vs SCLC vs LCC - 355 subjects)      (NSCLC vs SCLC - 355 subjects)
┌────────────────────────────────┐       ┌────────────────────────────────────────┐      ┌─────────────────────────────┐
│ High Statistical Power         │       │ Evaluates LCC Class Scarcity           │      │ Clinical Treatment Fork     │
│ 37 ADC, 9 SCC, 5 SCLC Test Pts │       │ Class-Weighted Cross-Entropy           │      │ 47 NSCLC vs 5 SCLC Test Pts │
└────────────────────────────────┘       └────────────────────────────────────────┘      └─────────────────────────────┘
```

### Tier 1: Primary Statistically Defensible Benchmark (3-Class Schema)
- **Target Classes:** Adenocarcinoma (ADC), Squamous Cell Carcinoma (SCC), Small Cell Lung Carcinoma (SCLC).
- **Total Patients:** **350 subjects** (246 Train / 53 Val / 51 Test).
- **Academic Justification:** Every test class has $\ge 5$ distinct test patients, enabling statistically valid confusion matrices, per-class F1-scores, precision/recall curves, and ROC-AUC metrics without single-patient sample artifacts.

### Tier 2: Exploratory Capstone Investigation (4-Class Schema)
- **Target Classes:** ADC, SCC, SCLC, Large Cell Carcinoma (LCC).
- **Total Patients:** **355 subjects** (249 Train / 54 Val / 52 Test).
- **Class Weighting:**  
  $$w_c = \frac{N_{total}}{K \cdot N_c}$$  
  Where $K=4$, $N_{ADC}=251, N_{SCC}=61, N_{SCLC}=38, N_{LCC}=5$.
- **Academic Transparency & Limitation Notice:**  
  Since $N_{test, LCC} = 1$ patient, per-class metrics for LCC represent a single test case evaluation. This limitation will be explicitly reported in all research tables and vivas (no synthetic patients fabricated).

### Tier 3: Clinical Hierarchy Benchmark (Binary NSCLC vs SCLC Schema)
- **Target Classes:** Non-Small Cell Lung Cancer (NSCLC: ADC + SCC + LCC = 317 subjects) vs. Small Cell Lung Cancer (SCLC: 38 subjects).
- **Academic Justification:** Mirrors the primary clinical oncology decision node for systemic therapy selection (Chemotherapy/Immunotherapy regimen fork).

---

## 4. Model Architectures & Attention Mechanism (CBAM)

For each benchmark tier, we execute two comparative model runs:

```
Input CT Tensor (224x224x3)
       │
       ▼
Deep CNN Backbone (ResNet-50 / DenseNet-121)
       │
       ├──────────────────────────────────────────┐
       │ (Baseline Route)                         │ (Proposed Route)
       ▼                                          ▼
Global Average Pooling                 Convolutional Block Attention (CBAM)
       │                                          │
       │                                 ┌────────┴────────┐
       │                                 ▼                 ▼
       │                          Channel Attention  Spatial Attention
       │                                 └────────┬────────┘
       │                                          ▼
       │                                 Feature Map Refinement
       │                                          │
       │                                 Global Average Pooling
       │                                          │
       └──────────────────┬───────────────────────┘
                          ▼
             Linear Classifier & Softmax
                          │
                          ▼
            Subtype Probabilities & Grad-CAM
```

### 4.1 Baseline Model
- **Backbone:** ResNet-50 pretrained on ImageNet (medical fine-tuning).
- **Classifier:** Dropout (0.5) -> Linear layer ($2048 \rightarrow K$).

### 4.2 Proposed Model (CNN + CBAM Attention)
- **Backbone:** ResNet-50 / DenseNet-121 with integrated **Convolutional Block Attention Module (CBAM)** inserted after layer3 and layer4 residual blocks.
- **Channel Attention Module (CAM):**
  $$\mathbf{M}_c(\mathbf{F}) = \sigma\left(\text{MLP}(\text{AvgPool}(\mathbf{F})) + \text{MLP}(\text{MaxPool}(\mathbf{F}))\right)$$
- **Spatial Attention Module (SAM):**
  $$\mathbf{M}_s(\mathbf{F}') = \sigma\left(f^{7\times7}([\text{AvgPool}(\mathbf{F}'); \text{MaxPool}(\mathbf{F}')])\right)$$
- **Refinement:** $\mathbf{F}'' = \mathbf{M}_s(\mathbf{M}_c(\mathbf{F}) \otimes \mathbf{F}) \otimes (\mathbf{M}_c(\mathbf{F}) \otimes \mathbf{F})$.

---

## 5. Preprocessing & Augmentation Pipeline

1. **CT DICOM Windowing:**  
   Conversion of raw pixel values to Hounsfield Units (HU):
   $$\text{HU} = \text{PixelValue} \times \text{RescaleSlope} + \text{RescaleIntercept}$$
   Apply standard Lung Windowing: Level (L) = $-600\text{ HU}$, Width (W) = $1500\text{ HU}$.
2. **Resizing & Normalization:** Resized to $224 \times 224 \times 3$, normalized using ImageNet mean $[0.485, 0.456, 0.406]$ and std $[0.229, 0.224, 0.225]$.
3. **Training Data Augmentation Only:** Random horizontal flipping ($p=0.5$), subtle affine rotation ($\pm 10^\circ$), random brightness/contrast adjustment ($\pm 10\%$). **Validation and Test data are strictly unaugmented**.

---

## 6. Training Hyperparameters & Reproducibility Setup

- **Optimizer:** AdamW ($\beta_1=0.9, \beta_2=0.999$, weight decay = $1\times 10^{-4}$)
- **Initial Learning Rate:** $1\times 10^{-4}$ with Cosine Annealing Learning Rate Scheduler ($\eta_{min} = 1\times 10^{-6}$)
- **Batch Size:** 32 (slice level) with patient-stratified batching
- **Epochs:** 30 epochs with Early Stopping (patience = 7 epochs on validation loss)
- **Loss Function:** Class-Weighted Cross-Entropy Loss
- **Random Seed:** `42` (PyTorch, NumPy, Python `random`)
- **Model Checkpointing:** Best model weights saved to `ml/models/weights/best_model.pth`.

---

## 7. Explainable AI Engine (Grad-CAM)

For the trained attention-enhanced CNN:
1. Target the final convolutional feature layer (`layer4`).
2. Compute gradient of winning target class score $y^c$ with respect to feature maps $A^k$:
   $$\alpha_k^c = \frac{1}{Z} \sum_i \sum_j \frac{\partial y^c}{\partial A_{i,j}^k}$$
3. Generate Grad-CAM heatmap:
   $$L_{\text{Grad-CAM}}^c = \text{ReLU}\left(\sum_k \alpha_k^c A^k\right)$$
4. Overlay heatmap on original CT slice to highlight diagnostic focus regions.

---

## 8. Academic Deliverables & Verification Checklist

- [x] Phase 1: Dataset Research & Verification Report (`docs/dataset.md`)
- [x] Phase 2: Monorepo Scaffolding & Setup (`README.md`, `docker-compose.yml`, `backend/`, `frontend/`, `ml/`)
- [x] Phase 3: Dataset Manifest & Leakage Audit (`data/metadata/manifest.csv`, `data/metadata/patient_splits.json`, `ml/reports/eda_report.md`)
- [x] Phase 4 (Proposed Plan): Experimental Design & Methodology Report (`ml/reports/phase4_experimental_design.md`)
- [ ] Phase 4 (Execution): Model Training (Baseline vs. CBAM Attention) across 3 Tiers
- [ ] Phase 4 (Execution): Quantitative Evaluation & Comparative Results Matrix (`ml/reports/evaluation_results.md`)
- [ ] Phase 4 (Execution): Grad-CAM Heatmap Generation & Visual Verification
- [ ] Phase 5: FastAPI REST API & PostgreSQL Database Integration
- [ ] Phase 6: React + TypeScript + Tailwind Web Application Integration
- [ ] Phase 7: ReportLab PDF Analysis Report Generation
- [ ] Phase 8: Automated Test Suite (pytest, API Client, Frontend Build)
