"""
Baseline Deep Convolutional Neural Network (CNN) Model
------------------------------------------------------
ResNet-18 deep CNN backbone for multi-class lung cancer subtype classification.
Serves as the reference baseline model before attention mechanism enhancement.
"""

import torch
import torch.nn as nn
import torchvision.models as models

class BaselineCNN(nn.Module):
    def __init__(self, num_classes=3, pretrained=False, dropout_rate=0.5):
        super(BaselineCNN, self).__init__()
        self.num_classes = num_classes

        self.backbone = models.resnet18(weights=None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(p=dropout_rate),
            nn.Linear(in_features, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

    def get_target_layer(self):
        """Returns the final convolutional feature layer for Grad-CAM inspection."""
        return self.backbone.layer4
