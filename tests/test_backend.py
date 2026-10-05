"""
Automated Test Suite for Backend REST API and ML Engine
-------------------------------------------------------
Verifies PyTorch model forward pass, CBAM attention modules, DICOM preprocessing,
Grad-CAM overlay outputs, and FastAPI REST endpoints.
"""

import sys
import os

# Add root and backend directories to sys.path
sys.path.insert(0, os.path.abspath("backend"))
sys.path.insert(0, os.path.abspath("."))

import pytest
import torch
import numpy as np
from fastapi.testclient import TestClient

from ml.preprocessing.dicom_loader import apply_lung_window, generate_synthetic_lung_ct_slice
from ml.models.baseline_cnn import BaselineCNN
from ml.models.attention_cnn import AttentionCNN
from ml.explainability.gradcam import GradCAM
from backend.app.main import app

client = TestClient(app)

def test_dicom_windowing():
    raw_hu = np.array([-1000.0, -600.0, 150.0, 1000.0], dtype=np.float32)
    windowed = apply_lung_window(raw_hu)
    assert windowed.min() >= 0.0
    assert windowed.max() <= 1.0
    assert windowed.shape == (4,)

def test_synthetic_ct_tensor_shape():
    tensor = generate_synthetic_lung_ct_slice("Lung_Dx-A0001", "Adenocarcinoma (ADC)", slice_idx=0)
    assert tensor.shape == (3, 224, 224)
    assert isinstance(tensor, torch.Tensor)

def test_baseline_cnn_forward():
    model = BaselineCNN(num_classes=3, pretrained=False)
    x = torch.randn(2, 3, 224, 224)
    logits = model(x)
    assert logits.shape == (2, 3)

def test_attention_cbam_cnn_forward():
    model = AttentionCNN(num_classes=3, pretrained=False)
    x = torch.randn(2, 3, 224, 224)
    logits = model(x)
    assert logits.shape == (2, 3)

def test_gradcam_generation():
    model = AttentionCNN(num_classes=3, pretrained=False)
    gradcam = GradCAM(model, model.get_target_layer())
    x = torch.randn(1, 3, 224, 224)
    heatmap, pred_class, probs = gradcam.generate_heatmap(x)
    assert heatmap.shape == (224, 224)
    assert pred_class in [0, 1, 2]
    assert len(probs) == 3

def test_fastapi_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_fastapi_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_fastapi_get_patients():
    response = client.get("/api/v1/patients")
    assert response.status_code == 200
    patients = response.json()
    assert isinstance(patients, list)
    assert len(patients) >= 1
