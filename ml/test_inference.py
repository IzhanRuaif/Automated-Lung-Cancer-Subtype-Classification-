"""
Direct PyTorch Model Inference Verification Script
---------------------------------------------------
Loads trained AttentionCNN model weights, processes input CT images through
the exact training preprocessing pipeline, and outputs logits, softmax probabilities,
predicted class, and Grad-CAM heatmap validation.
"""

import os
import sys
import torch
import numpy as np
from PIL import Image

# Ensure root directory imports succeed
sys.path.insert(0, os.path.abspath("."))

from ml.models.attention_cnn import AttentionCNN
from ml.preprocessing.dicom_loader import apply_lung_window, generate_synthetic_lung_ct_slice
from ml.explainability.gradcam import GradCAM, create_gradcam_overlay

WEIGHTS_PATH = "ml/models/weights/attention_cbam_3-class.pth"
CLASSES = ["Adenocarcinoma (ADC)", "Squamous Cell Carcinoma (SCC)", "Small Cell Lung Carcinoma (SCLC)"]

def load_and_preprocess_image(image_path: str) -> torch.Tensor:
    """
    Loads an image file into a normalized 3-channel PyTorch tensor (1, 3, 224, 224).
    """
    if os.path.exists(image_path) and os.path.isfile(image_path):
        ext = os.path.splitext(image_path)[1].lower()
        if ext in [".dcm", ".dcm.gz"]:
            import pydicom
            ds = pydicom.dcmread(image_path)
            arr = ds.pixel_array.astype(np.float32)
            slope = getattr(ds, 'RescaleSlope', 1.0)
            intercept = getattr(ds, 'RescaleIntercept', 0.0)
            hu_matrix = arr * slope + intercept
            windowed = apply_lung_window(hu_matrix)
            img_pil = Image.fromarray((windowed * 255).astype(np.uint8)).convert("RGB")
        else:
            img_pil = Image.open(image_path).convert("RGB")

        img_pil = img_pil.resize((224, 224))
        img_np = np.array(img_pil, dtype=np.float32) / 255.0
        img_chw = np.transpose(img_np, (2, 0, 1))
        return torch.tensor(img_chw, dtype=torch.float32).unsqueeze(0)
    else:
        # Fallback slice tensor
        return generate_synthetic_lung_ct_slice("TEST_PATIENT", "Adenocarcinoma (ADC)").unsqueeze(0)

def test_direct_inference(image_path: str = None):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"=== DIRECT PYTORCH INFERENCE TEST ===")
    print(f"Device: {device}")
    print(f"Weights Path: {WEIGHTS_PATH}")
    print(f"Weights Exist: {os.path.exists(WEIGHTS_PATH)}")

    # 1. Instantiate Model Architecture
    model = AttentionCNN(num_classes=3, pretrained=False)
    
    if os.path.exists(WEIGHTS_PATH):
        state_dict = torch.load(WEIGHTS_PATH, map_location=device)
        model.load_state_dict(state_dict)
        print("Successfully loaded trained model weights into AttentionCNN architecture.")
    else:
        print("WARNING: Checkpoint weights file not found!")

    model.to(device)
    model.eval()

    # 2. Load and Preprocess Image
    if not image_path:
        image_path = "data/uploads/sample_adc_scan.jpg" if os.path.exists("data/uploads/sample_adc_scan.jpg") else ""

    print(f"Input Image Path: {image_path}")
    input_tensor = load_and_preprocess_image(image_path).to(device)
    
    print(f"Input Tensor Shape: {input_tensor.shape}")
    print(f"Input Tensor dtype: {input_tensor.dtype}")
    print(f"Input Tensor Min/Max: {input_tensor.min().item():.4f} / {input_tensor.max().item():.4f}")

    # 3. Model Forward Pass & Logits
    with torch.no_grad():
        logits = model(input_tensor)
        probs_tensor = torch.softmax(logits, dim=1)
        probs = probs_tensor.cpu().numpy()[0]

    pred_idx = int(np.argmax(probs))
    predicted_class = CLASSES[pred_idx]
    confidence = float(probs[pred_idx])

    print("\n--- INFERENCE RESULTS ---")
    print(f"Raw Logits: {logits.cpu().numpy()[0]}")
    print(f"Predicted Class Index: {pred_idx}")
    print(f"Predicted Class Label: {predicted_class}")
    print(f"Confidence Score: {confidence * 100:.2f}%")
    print("Probability Distribution:")
    for idx, cname in enumerate(CLASSES):
        print(f"  [{idx}] {cname}: {probs[idx]*100:.2f}%")

    # 4. Verify Probability Constraints
    prob_sum = float(np.sum(probs))
    is_valid = np.all(np.isfinite(probs)) and (0.99 <= prob_sum <= 1.01) and (0 <= pred_idx < len(CLASSES))
    print(f"\nProbability Sum: {prob_sum:.6f}")
    print(f"Validation Checks Passed: {is_valid}")

    # 5. Grad-CAM Visual Heatmap Test
    gradcam = GradCAM(model, model.get_target_layer())
    heatmap, target_cls, _ = gradcam.generate_heatmap(input_tensor, target_class=pred_idx)
    img_np, heat_np, overlay_np = create_gradcam_overlay(input_tensor, heatmap)
    print(f"Grad-CAM Heatmap Generated for Target Class [{target_cls}]: Shape {heatmap.shape}, Max {heatmap.max():.4f}")

    return {
        "predicted_index": pred_idx,
        "predicted_class": predicted_class,
        "confidence": confidence,
        "probabilities": {CLASSES[i]: float(probs[i]) for i in range(len(CLASSES))},
        "is_valid": is_valid
    }

if __name__ == "__main__":
    img = sys.argv[1] if len(sys.argv) > 1 else None
    test_direct_inference(img)
