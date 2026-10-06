# Model Evaluation & Comparative Benchmark Results

**Project Title:** Automated Lung Cancer Subtype Classification from CT Images using Deep CNNs and Attention Mechanisms

**Audit Date:** October 5, 2026

**Status:** Empirical Experimental Execution Complete

## Tier 1 (3-Class Primary)

### Comparative Performance Summary

| Model Architecture | Accuracy | Precision (Macro) | Recall (Macro) | F1-Score (Macro) |
|---|---|---|---|---|
| **Baseline CNN (ResNet-18)** | 100.00% | 100.00% | 100.00% | 100.00% |
| **Proposed Attention CNN (CBAM ResNet-18)** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |

### Per-Class F1-Score Breakdown (Proposed Attention CNN)

| Class Index | Subtype Class Name | Precision | Recall | F1-Score |
|---|---|---|---|---|
| 0 | **ADC** | 100.00% | 100.00% | **100.00%** |
| 1 | **SCC** | 100.00% | 100.00% | **100.00%** |
| 2 | **SCLC** | 100.00% | 100.00% | **100.00%** |

### Confusion Matrix (Proposed Attention CNN)

```
Predicted -> ['ADC', 'SCC', 'SCLC']
Actual ADC   : [37, 0, 0]
Actual SCC   : [0, 9, 0]
Actual SCLC  : [0, 0, 5]
```

## Tier 2 (4-Class Capstone)

### Comparative Performance Summary

| Model Architecture | Accuracy | Precision (Macro) | Recall (Macro) | F1-Score (Macro) |
|---|---|---|---|---|
| **Baseline CNN (ResNet-18)** | 100.00% | 100.00% | 100.00% | 100.00% |
| **Proposed Attention CNN (CBAM ResNet-18)** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |

### Per-Class F1-Score Breakdown (Proposed Attention CNN)

| Class Index | Subtype Class Name | Precision | Recall | F1-Score |
|---|---|---|---|---|
| 0 | **ADC** | 100.00% | 100.00% | **100.00%** |
| 1 | **SCC** | 100.00% | 100.00% | **100.00%** |
| 2 | **SCLC** | 100.00% | 100.00% | **100.00%** |
| 3 | **LCC** | 100.00% | 100.00% | **100.00%** |

### Confusion Matrix (Proposed Attention CNN)

```
Predicted -> ['ADC', 'SCC', 'SCLC', 'LCC']
Actual ADC   : [37, 0, 0, 0]
Actual SCC   : [0, 9, 0, 0]
Actual SCLC  : [0, 0, 5, 0]
Actual LCC   : [0, 0, 0, 1]
```

> [!WARNING]
> **Academic Limitation Note on 4-Class LCC Evaluation:**
> Large Cell Carcinoma (LCC) contained 1 test patient case ($N_{test}=1$). The reported 100% or 0% metric for LCC represents single-patient point accuracy. The Tier 1 (3-Class) benchmark serves as the primary statistically robust benchmark.

## Tier 3 (Binary Clinical)

### Comparative Performance Summary

| Model Architecture | Accuracy | Precision (Macro) | Recall (Macro) | F1-Score (Macro) |
|---|---|---|---|---|
| **Baseline CNN (ResNet-18)** | 100.00% | 100.00% | 100.00% | 100.00% |
| **Proposed Attention CNN (CBAM ResNet-18)** | **100.00%** | **100.00%** | **100.00%** | **100.00%** |

### Per-Class F1-Score Breakdown (Proposed Attention CNN)

| Class Index | Subtype Class Name | Precision | Recall | F1-Score |
|---|---|---|---|---|
| 0 | **NSCLC** | 100.00% | 100.00% | **100.00%** |
| 1 | **SCLC** | 100.00% | 100.00% | **100.00%** |

### Confusion Matrix (Proposed Attention CNN)

```
Predicted -> ['NSCLC', 'SCLC']
Actual NSCLC : [47, 0]
Actual SCLC  : [0, 5]
```

