"""
Unit Tests for Grad-CAM Explainability Engine
---------------------------------------------
Verifies gradient hook registration, heatmap generation, normalization,
softmax probability outputs, and composite image overlay creation.
"""

import sys
import os
import torch
import numpy as np
import pytest

sys.path.insert(0, os.path.abspath("."))

from ml.models.attention_cnn import AttentionCNN
from ml.explainability.gradcam import GradCAM, create_gradcam_overlay

def test_gradcam_heatmap_generation():
    """Verify GradCAM generates 2D heatmap [224, 224] bounded between [0, 1]."""
    model = AttentionCNN(num_classes=3, pretrained=False)
    gradcam = GradCAM(model, model.get_target_layer())
    
    input_tensor = torch.randn(1, 3, 224, 224)
    heatmap, pred_class, probs = gradcam.generate_heatmap(input_tensor, target_class=0)
    
    assert heatmap.shape == (224, 224)
    assert heatmap.min() >= 0.0
    assert heatmap.max() <= 1.0
    assert pred_class == 0
    assert len(probs) == 3
    assert np.isclose(np.sum(probs), 1.0, atol=1e-3)

def test_gradcam_overlay_creation():
    """Verify create_gradcam_overlay returns 3 uint8 RGB image arrays (CT, Heatmap, Overlay)."""
    model = AttentionCNN(num_classes=3, pretrained=False)
    gradcam = GradCAM(model, model.get_target_layer())
    
    input_tensor = torch.rand(1, 3, 224, 224)
    heatmap, _, _ = gradcam.generate_heatmap(input_tensor)
    
    img_np, heat_np, overlay_np = create_gradcam_overlay(input_tensor, heatmap, alpha=0.5)
    
    assert img_np.shape == (224, 224, 3)
    assert heat_np.shape == (224, 224, 3)
    assert overlay_np.shape == (224, 224, 3)
    assert img_np.dtype == np.uint8
    assert overlay_np.dtype == np.uint8
