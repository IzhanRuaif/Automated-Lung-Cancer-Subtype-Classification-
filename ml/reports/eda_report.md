# Exploratory Data Analysis (EDA) & Patient Manifest Report

**Dataset Source:** TCIA `Lung-PET-CT-Dx` (DOI: `10.7937/TCIA.2020.NNC2-0461`)

**Audit Date:** September 22, 2026

**Random Seed:** 42

## 1. Official Dataset Summary Statistics

| Metric | Value |
|---|---|
| **Total Official Subjects in Repository** | **355** |
| **Total Usable Subjects** | **355** |
| **Total Excluded Subjects** | **0** |
| **Total Usable CT Studies / Series** | **1162** |
| **Total Usable Axial CT Slices** | **205,459** |
| **Subjects with Valid XML ROI Annotations** | **355** |

## 2. Exclusion Audit & Categories

| Exclusion Category | Count | Reason / Justification |
|---|---|---|
| **Unclassified Subtype** | 0 | Filtered to prevent non-CT or corrupted data contamination |
| **Missing / 0 CT Series** | 0 | Filtered to prevent non-CT or corrupted data contamination |
| **Insufficient CT Slice Depth (< 10 slices)** | 0 | Filtered to prevent non-CT or corrupted data contamination |

## 3. Verified Patient Breakdown Per Subtype

| Histopathological Subtype | Subject ID Prefix | Total Subjects | Usable Subjects | Usable % | Total Usable CT Slices |
|---|---|---|---|---|---|
| **Adenocarcinoma (ADC)** | `Lung_Dx-A` | 251 | **251** | 70.7% | 150,552 |
| **Squamous Cell Carcinoma (SCC)** | `Lung_Dx-G` | 61 | **61** | 17.2% | 39,666 |
| **Small Cell Lung Carcinoma (SCLC)** | `Lung_Dx-B` | 38 | **38** | 10.7% | 14,433 |
| **Large Cell Carcinoma (LCC)** | `Lung_Dx-E` | 5 | **5** | 1.4% | 808 |

## 4. Patient-Level Stratified Train / Validation / Test Split

Strict patient-level stratification enforced. **Zero patient overlap** exists across splits to prevent data leakage.

| Subtype | Train Patients (70%) | Val Patients (15%) | Test Patients (15%) | Total Usable |
|---|---|---|---|---|
| **Adenocarcinoma (ADC)** | **176** | **38** | **37** | **251** |
| **Large Cell Carcinoma (LCC)** | **3** | **1** | **1** | **5** |
| **Small Cell Lung Carcinoma (SCLC)** | **27** | **6** | **5** | **38** |
| **Squamous Cell Carcinoma (SCC)** | **43** | **9** | **9** | **61** |

## 5. Scientific Feasibility & Class Imbalance Analysis

- **Adenocarcinoma (ADC)** and **Squamous Cell Carcinoma (SCC)** constitute the majority of cases (312 / 355 patients = 87.9%).
- **Small Cell Lung Carcinoma (SCLC)** comprises 38 patients (10.7%).
- **Large Cell Carcinoma (LCC)** comprises 5 patients (1.4%).

> [!WARNING]
> **CLASS SCARCITY NOTICE — LARGE CELL CARCINOMA (LCC):**
> Large Cell Carcinoma (LCC) has only **5 usable patients** out of 355.
> Stratified splitting yields:
> • **Train:** 3 patients
> • **Val:** 1 patient
> • **Test:** 1 patient
>
> **Scientific Feasibility Recommendation:**
> 1. **Primary Evaluation (3-Class Major Subtypes):** Train and evaluate **ADC vs. SCC vs. SCLC** (total **350 subjects**) as the main statistically robust multiclass benchmark.
> 2. **Secondary Evaluation (4-Class Schema):** Train the 4-class classifier with **Class-Weighted Cross-Entropy Loss** and report per-class metrics alongside macro/weighted metrics.
> 3. **Strict Policy:** No fake labels, duplicates, or synthetic samples were generated.
