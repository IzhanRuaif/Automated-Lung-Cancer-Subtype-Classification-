"""
Metrics & Evaluation Calculation Engine
---------------------------------------
Computes empirical classification metrics: Accuracy, Precision, Recall, F1-score (Macro & Weighted),
per-class metrics, confusion matrices, and formats comparative analysis tables.
"""

import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

def compute_classification_metrics(y_true, y_pred, class_names):
    """
    Computes comprehensive, un-fabricated classification metrics.
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    num_classes = len(class_names)

    acc = float(accuracy_score(y_true, y_pred))
    p_macro, r_macro, f1_macro, _ = precision_recall_fscore_support(y_true, y_pred, average='macro', zero_division=0)
    p_weighted, r_weighted, f1_weighted, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)

    p_per_class, r_per_class, f1_per_class, support_per_class = precision_recall_fscore_support(
        y_true, y_pred, labels=list(range(num_classes)), average=None, zero_division=0
    )

    cm = confusion_matrix(y_true, y_pred, labels=list(range(num_classes)))

    per_class_results = {}
    for idx, cname in enumerate(class_names):
        per_class_results[cname] = {
            "precision": float(p_per_class[idx]),
            "recall": float(r_per_class[idx]),
            "f1": float(f1_per_class[idx]),
            "support": int(support_per_class[idx])
        }

    return {
        "accuracy": float(acc),
        "precision_macro": float(p_macro),
        "recall_macro": float(r_macro),
        "f1_macro": float(f1_macro),
        "precision_weighted": float(p_weighted),
        "recall_weighted": float(r_weighted),
        "f1_weighted": float(f1_weighted),
        "per_class": per_class_results,
        "confusion_matrix": cm.tolist()
    }
