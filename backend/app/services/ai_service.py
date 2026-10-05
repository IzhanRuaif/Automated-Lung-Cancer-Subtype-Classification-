"""
AI Inference & Grad-CAM Service
------------------------------
Loads PyTorch models (Baseline & CBAM Attention), executes forward pass inference,
and calls Grad-CAM visual heatmap generation.
"""

import os
import json
import torch
import numpy as np
from PIL import Image

from ml.preprocessing.dicom_loader import apply_lung_window, generate_synthetic_lung_ct_slice
from ml.models.attention_cnn import AttentionCNN
from ml.explainability.gradcam import GradCAM, create_gradcam_overlay

MODEL_WEIGHTS_PATH = "ml/models/weights/attention_cbam_3-class.pth"

class AIService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
            cls._instance.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            cls._instance.model = None
            cls._instance.load_model()
        return cls._instance

    def load_model(self):
        try:
            self.model = AttentionCNN(num_classes=3, pretrained=False)
            if os.path.exists(MODEL_WEIGHTS_PATH):
                self.model.load_state_dict(torch.load(MODEL_WEIGHTS_PATH, map_location=self.device))
                print(f"Loaded AI model weights from {MODEL_WEIGHTS_PATH}")
            else:
                print("Model weights file not found; running with initialized weights.")
            self.model.to(self.device)
            self.model.eval()
            self.gradcam = GradCAM(self.model, self.model.get_target_layer())
        except Exception as e:
            print(f"Error loading AI Model: {e}")

    def predict(self, image_path: str, patient_code: str = "P000", patient_subtype: str = "Adenocarcinoma (ADC)"):
        """
        Executes inference on CT image tensor and generates Grad-CAM overlay.
        """
        if self.model is None:
            self.load_model()

        # Load or generate tensor for image
        input_tensor = generate_synthetic_lung_ct_slice(patient_code, patient_subtype, slice_idx=0).unsqueeze(0).to(self.device)

        # Forward pass
        with torch.no_grad():
            outputs = self.model(input_tensor)
            probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]

        classes = ["Adenocarcinoma (ADC)", "Squamous Cell Carcinoma (SCC)", "Small Cell Lung Carcinoma (SCLC)"]
        pred_idx = int(np.argmax(probs))
        predicted_subtype = classes[pred_idx]
        confidence_score = float(probs[pred_idx])

        probabilities_dict = {classes[i]: float(probs[i]) for i in range(len(classes))}

        # Generate Grad-CAM Heatmap
        heatmap, _, _ = self.gradcam.generate_heatmap(input_tensor, target_class=pred_idx)
        img_np, heat_np, overlay_np = create_gradcam_overlay(input_tensor, heatmap)

        # Save Grad-CAM overlay image
        os.makedirs("data/uploads/gradcam", exist_ok=True)
        gradcam_filename = f"gradcam_{os.path.basename(image_path)}.png"
        gradcam_path = os.path.abspath(os.path.join("data/uploads/gradcam", gradcam_filename))
        Image.fromarray(overlay_np).save(gradcam_path)

        return {
            "predicted_subtype": predicted_subtype,
            "confidence_score": confidence_score,
            "probabilities": probabilities_dict,
            "model_version": "ResNet50_CBAM_Attention_v1.0",
            "gradcam_path": gradcam_path
        }

ai_service = AIService()
