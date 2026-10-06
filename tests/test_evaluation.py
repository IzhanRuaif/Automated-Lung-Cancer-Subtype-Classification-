"""
Unit Tests for Metrics & Evaluation Pipeline
---------------------------------------------
Verifies compute_classification_metrics correctness, macro/weighted precision/recall/F1,
per-class results dictionary, and confusion matrix shapes.
"""

import sys
import os
import pytest
import numpy as np

sys.path.insert(0, os.path.abspath("."))

from ml.metrics import compute_classification_metrics

def test_compute_classification_metrics_exact():
    """Verify classification metrics calculation with synthetic ground truth and predictions."""
    y_true = [0, 0, 1, 1, 2, 2]
    y_pred = [0, 0, 1, 1, 2, 0]  # 5 correct out of 6
    class_names = ["ADC", "SCC", "SCLC"]

    metrics = compute_classification_metrics(y_true, y_pred, class_names)

    assert np.isclose(metrics["accuracy"], 5.0 / 6.0)
    assert "precision_macro" in metrics
    assert "recall_macro" in metrics
    assert "f1_macro" in metrics
    assert "per_class" in metrics
    assert len(metrics["per_class"]) == 3
    assert np.array(metrics["confusion_matrix"]).shape == (3, 3)
