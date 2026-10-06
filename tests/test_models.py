"""
Unit Tests for Deep CNN & Attention Model Architectures
------------------------------------------------------
Verifies forward pass logits, target layer retrieval, batch processing, and output dimensions
for Baseline ResNet-18 and Proposed ResNet-18 + CBAM Attention.
"""

import sys
import os
import torch
import pytest

sys.path.insert(0, os.path.abspath("."))

from ml.models.baseline_cnn import BaselineCNN
from ml.models.attention_cnn import AttentionCNN, CBAM, ChannelAttention, SpatialAttention

def test_baseline_resnet18_forward():
    """Verify Baseline ResNet-18 outputs logits of shape [batch_size, num_classes]."""
    model = BaselineCNN(num_classes=3, pretrained=False)
    x = torch.randn(4, 3, 224, 224)
    logits = model(x)
    
    assert logits.shape == (4, 3)
    assert model.get_target_layer() is not None

def test_cbam_attention_modules():
    """Verify ChannelAttention and SpatialAttention module tensor dimensions."""
    ca = ChannelAttention(in_planes=256, reduction_ratio=16)
    sa = SpatialAttention(kernel_size=7)
    cbam = CBAM(planes=256)
    
    feat = torch.randn(2, 256, 14, 14)
    out_ca = ca(feat)
    out_sa = sa(feat)
    out_cbam = cbam(feat)
    
    assert out_ca.shape == (2, 256, 1, 1)
    assert out_sa.shape == (2, 1, 14, 14)
    assert out_cbam.shape == (2, 256, 14, 14)

def test_attention_cnn_forward_3class():
    """Verify Proposed AttentionCNN (ResNet-18 + CBAM) forward pass for 3 classes."""
    model = AttentionCNN(num_classes=3, pretrained=False)
    x = torch.randn(2, 3, 224, 224)
    logits = model(x)
    
    assert logits.shape == (2, 3)
    assert model.get_target_layer() == model.layer4

def test_attention_cnn_forward_4class():
    """Verify Proposed AttentionCNN (ResNet-18 + CBAM) forward pass for 4 classes."""
    model = AttentionCNN(num_classes=4, pretrained=False)
    x = torch.randn(2, 3, 224, 224)
    logits = model(x)
    
    assert logits.shape == (2, 4)
