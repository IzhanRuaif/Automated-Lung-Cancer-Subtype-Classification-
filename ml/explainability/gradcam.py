"""
Grad-CAM (Gradient-Weighted Class Activation Mapping) Engine
------------------------------------------------------------
Provides visual explainability heatmaps for model predictions by computing gradient
weights with respect to target convolutional feature maps.
"""

import numpy as np
import torch
import torch.nn.functional as F
import cv2

class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None

        # Register forward and backward hooks
        self.target_layer.register_forward_hook(self._forward_hook)
        self.target_layer.register_full_backward_hook(self._backward_hook)

    def _forward_hook(self, module, input, output):
        self.activations = output.detach()

    def _backward_hook(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate_heatmap(self, input_tensor, target_class=None):
        self.model.eval()
        self.model.zero_grad()

        # Forward pass
        output = self.model(input_tensor)

        if target_class is None:
            target_class = torch.argmax(output, dim=1).item()

        score = output[0, target_class]
        score.backward()

        # Compute channel weights via global average pooling of gradients
        gradients = self.gradients[0]  # [C, H, W]
        activations = self.activations[0]  # [C, H, W]

        weights = torch.mean(gradients, dim=(1, 2), keepdim=True)  # [C, 1, 1]
        cam = torch.sum(weights * activations, dim=0)  # [H, W]

        cam = F.relu(cam)
        cam = cam.cpu().numpy()

        # Resize heatmap to input tensor dimensions
        h, w = input_tensor.shape[2], input_tensor.shape[3]
        heatmap = cv2.resize(cam, (w, h))

        # Suppress outer border padding artifacts outside lung parenchyma
        border_mask = np.ones((h, w), dtype=np.float32)
        border_mask[:20, :] = 0.05
        border_mask[-20:, :] = 0.05
        border_mask[:, :20] = 0.05
        border_mask[:, -20:] = 0.05
        heatmap = heatmap * border_mask

        if np.max(heatmap) > 0:
            heatmap = heatmap / np.max(heatmap)

        return heatmap, target_class, F.softmax(output, dim=1).detach().cpu().numpy()[0]

def create_gradcam_overlay(input_tensor, heatmap, alpha=0.5):
    """
    Creates a composite image with Original CT, Heatmap, and Overlay.
    Returns RGB uint8 image arrays.
    """
    img_np = input_tensor[0].cpu().numpy().transpose(1, 2, 0)
    img_np = (img_np * 255).astype(np.uint8)

    # Convert heatmap to JET colormap
    heatmap_uint8 = np.uint8(255 * heatmap)
    color_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    color_heatmap = cv2.cvtColor(color_heatmap, cv2.COLOR_BGR2RGB)

    # Blend CT image and Heatmap
    overlay = cv2.addWeighted(img_np, 1.0 - alpha, color_heatmap, alpha, 0)
    return img_np, color_heatmap, overlay
