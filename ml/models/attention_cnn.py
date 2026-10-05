"""
Proposed Attention-Enhanced Deep CNN (CBAM ResNet-18)
------------------------------------------------------
Integrates Convolutional Block Attention Module (CBAM) with Channel Attention
and Spatial Attention modules after bottleneck feature layers for adaptive feature refinement.
"""

import torch
import torch.nn as nn
import torchvision.models as models

class ChannelAttention(nn.Module):
    """
    Channel Attention Module (CAM)
    Recalibrates channel-wise feature importance via shared MLP on MaxPool and AvgPool descriptors.
    """
    def __init__(self, in_planes, reduction_ratio=16):
        super(ChannelAttention, self).__init__()
        self.avg_pool = nn.AdaptiveAvgPool2d(1)
        self.max_pool = nn.AdaptiveMaxPool2d(1)

        self.fc = nn.Sequential(
            nn.Conv2d(in_planes, in_planes // reduction_ratio, kernel_size=1, bias=False),
            nn.ReLU(inplace=True),
            nn.Conv2d(in_planes // reduction_ratio, in_planes, kernel_size=1, bias=False)
        )
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = self.fc(self.avg_pool(x))
        max_out = self.fc(self.max_pool(x))
        out = avg_out + max_out
        return self.sigmoid(out)

class SpatialAttention(nn.Module):
    """
    Spatial Attention Module (SAM)
    Refines spatial lesion location features via 7x7 convolution on Channel MaxPool and AvgPool maps.
    """
    def __init__(self, kernel_size=7):
        super(SpatialAttention, self).__init__()
        assert kernel_size in (3, 7), 'Kernel size must be 3 or 7'
        padding = 3 if kernel_size == 7 else 1

        self.conv1 = nn.Conv2d(2, 1, kernel_size, padding=padding, bias=False)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        x_concat = torch.cat([avg_out, max_out], dim=1)
        out = self.conv1(x_concat)
        return self.sigmoid(out)

class CBAM(nn.Module):
    """
    Convolutional Block Attention Module (CBAM)
    Sequentially applies Channel Attention followed by Spatial Attention.
    """
    def __init__(self, planes, reduction_ratio=16, kernel_size=7):
        super(CBAM, self).__init__()
        self.ca = ChannelAttention(planes, reduction_ratio)
        self.sa = SpatialAttention(kernel_size)

    def forward(self, x):
        x_out = x * self.ca(x)
        x_out = x_out * self.sa(x_out)
        return x_out

class AttentionCNN(nn.Module):
    """
    Attention-Enhanced ResNet-18 Architecture.
    Integrates CBAM attention modules after ResNet layer3 and layer4 feature stages.
    """
    def __init__(self, num_classes=3, pretrained=False, dropout_rate=0.5):
        super(AttentionCNN, self).__init__()
        self.num_classes = num_classes

        base_model = models.resnet18(weights=None)

        # Feature Extraction Layers
        self.conv1 = base_model.conv1
        self.bn1 = base_model.bn1
        self.relu = base_model.relu
        self.maxpool = base_model.maxpool

        self.layer1 = base_model.layer1
        self.layer2 = base_model.layer2
        self.layer3 = base_model.layer3
        self.cbam3 = CBAM(256)

        self.layer4 = base_model.layer4
        self.cbam4 = CBAM(512)

        self.avgpool = base_model.avgpool
        self.fc = nn.Sequential(
            nn.Dropout(p=dropout_rate),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        
        x = self.layer3(x)
        x = self.cbam3(x)

        x = self.layer4(x)
        x = self.cbam4(x)

        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)
        return x

    def get_target_layer(self):
        """Returns the final attention-refined feature layer for Grad-CAM explanation."""
        return self.layer4
