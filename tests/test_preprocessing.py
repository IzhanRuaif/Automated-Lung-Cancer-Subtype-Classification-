"""
Unit Tests for CT Preprocessing & DICOM Loader
-----------------------------------------------
Verifies medical lung windowing bounds [-600 HU, 1500 HU], normalization to [0, 1],
slice tensor generation, and PyTorch dataset loading with patient-level splits.
"""

import sys
import os
import torch
import numpy as np
import pytest

sys.path.insert(0, os.path.abspath("."))

from ml.preprocessing.dicom_loader import apply_lung_window, generate_synthetic_lung_ct_slice, LungCTDataset

def test_lung_window_clipping_and_normalization():
    """Verify HU clipping between -1350 and +150 HU mapped to [0, 1]."""
    raw_hu = np.array([-2000.0, -1350.0, -600.0, 150.0, 3000.0], dtype=np.float32)
    windowed = apply_lung_window(raw_hu, level=-600, width=1500)
    
    assert windowed[0] == 0.0  # -2000 clipped to min_hu = -1350
    assert windowed[1] == 0.0  # -1350 mapped to 0.0
    assert windowed[2] == 0.5  # -600 (level) mapped to 0.5
    assert windowed[3] == 1.0  # 150 mapped to 1.0
    assert windowed[4] == 1.0  # 3000 clipped to max_hu = 150
    assert windowed.dtype == np.float32

def test_synthetic_lung_ct_slice_dimensions():
    """Verify synthetic CT slice generator returns 3-channel RGB float tensor [3, 224, 224]."""
    tensor = generate_synthetic_lung_ct_slice("Lung_Dx-A0001", "Adenocarcinoma (ADC)", slice_idx=0, img_size=224)
    
    assert isinstance(tensor, torch.Tensor)
    assert tensor.shape == (3, 224, 224)
    assert tensor.dtype == torch.float32
    assert tensor.min() >= 0.0
    assert tensor.max() <= 1.0

def test_patient_ct_dataset_initialization():
    """Verify LungCTDataset loads patient samples cleanly for 3-class schema."""
    manifest_file = "data/metadata/manifest.json"
    split_file = "data/metadata/patient_splits.json"
    
    dataset = LungCTDataset(manifest_file, split_file, split_type="val", schema_mode="3-class")
    assert len(dataset) > 0
    
    img_tensor, label, pid = dataset[0]
    assert img_tensor.shape == (3, 224, 224)
    assert label in [0, 1, 2]
    assert isinstance(pid, str)
