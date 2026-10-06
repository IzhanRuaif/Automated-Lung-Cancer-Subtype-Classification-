"""
Reproducible Model Evaluation & Comparative Analysis Pipeline
-------------------------------------------------------------
Evaluates trained ResNet-18 Baseline and ResNet-18 + CBAM Attention models on the patient-level
test dataset split. Generates metrics JSON artifacts, confusion matrix plots, and comparative figures.
"""

import os
import sys
import json
import numpy as np
import torch
from torch.utils.data import DataLoader
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Ensure root directory imports succeed
sys.path.insert(0, os.path.abspath("."))

from ml.preprocessing.dicom_loader import LungCTDataset
from ml.models.baseline_cnn import BaselineCNN
from ml.models.attention_cnn import AttentionCNN
from ml.metrics import compute_classification_metrics

MANIFEST_FILE = "data/metadata/manifest.json"
SPLIT_FILE = "data/metadata/patient_splits.json"
WEIGHTS_DIR = "ml/models/weights"
EXPERIMENTS_DIR = "ml/experiments"
RESULTS_DIR = os.path.join(EXPERIMENTS_DIR, "results")
CM_DIR = os.path.join(EXPERIMENTS_DIR, "confusion_matrices")

os.makedirs(RESULTS_DIR, exist_ok=True)
os.makedirs(CM_DIR, exist_ok=True)

def plot_confusion_matrix(cm, class_names, title, save_path):
    """
    Renders and saves a high-resolution confusion matrix heatmap using pure matplotlib.
    """
    fig, ax = plt.subplots(figsize=(7, 5), dpi=300)
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)

    ax.set(
        xticks=np.arange(cm.shape[1]),
        yticks=np.arange(cm.shape[0]),
        xticklabels=class_names,
        yticklabels=class_names,
        title=title,
        ylabel='Actual Ground Truth Subtype',
        xlabel='Predicted Subtype'
    )

    plt.setp(ax.get_xticklabels(), rotation=25, ha="right", rotation_mode="anchor")

    # Loop over data dimensions and create text annotations.
    thresh = cm.max() / 2.
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, format(int(cm[i, j]), 'd'),
                    ha="center", va="center",
                    color="white" if cm[i, j] > thresh else "black",
                    fontweight="bold")

    fig.tight_layout()
    plt.savefig(save_path)
    plt.close(fig)
    print(f"Saved confusion matrix plot to: {save_path}")

def plot_metric_comparison(baseline_metrics, cbam_metrics, save_path):
    """
    Generates a comparative bar plot showing Baseline ResNet-18 vs ResNet-18 + CBAM.
    """
    metric_keys = ["accuracy", "precision_macro", "recall_macro", "f1_macro", "f1_weighted"]
    metric_labels = ["Accuracy", "Precision (Macro)", "Recall (Macro)", "F1 (Macro)", "F1 (Weighted)"]

    base_vals = [baseline_metrics[k] * 100 for k in metric_keys]
    cbam_vals = [cbam_metrics[k] * 100 for k in metric_keys]

    x = np.arange(len(metric_labels))
    width = 0.35

    plt.figure(figsize=(9, 5), dpi=300)
    rects1 = plt.bar(x - width/2, base_vals, width, label='ResNet-18 Baseline', color='#64748b')
    rects2 = plt.bar(x + width/2, cbam_vals, width, label='ResNet-18 + CBAM Attention (Proposed)', color='#2563eb')

    plt.ylabel('Percentage (%)', fontsize=11, fontweight='bold')
    plt.title('Baseline ResNet-18 vs Proposed CBAM Attention Model (3-Class Test Set)', fontsize=12, fontweight='bold', pad=12)
    plt.xticks(x, metric_labels, fontsize=9, fontweight='bold')
    plt.ylim(0, 105)
    plt.legend(loc='lower right', frameon=True)
    plt.grid(axis='y', linestyle='--', alpha=0.5)

    for rect in rects1:
        height = rect.get_height()
        plt.annotate(f'{height:.1f}%', xy=(rect.get_x() + rect.get_width() / 2, height),
                     xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8)

    for rect in rects2:
        height = rect.get_height()
        plt.annotate(f'{height:.1f}%', xy=(rect.get_x() + rect.get_width() / 2, height),
                     xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=8)

    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()
    print(f"Saved metric comparison figure to: {save_path}")

def evaluate_model(model, dataloader, device):
    model.eval()
    all_preds = []
    all_targets = []
    with torch.no_grad():
        for inputs, labels, _ in dataloader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            preds = torch.argmax(outputs, dim=1).cpu().numpy()
            all_preds.extend(preds)
            all_targets.extend(labels.numpy())
    return all_targets, all_preds

def run_evaluation_pipeline(schema_mode="3-class"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"--- Running Evaluation Pipeline (Schema: {schema_mode}, Device: {device}) ---")

    if schema_mode == "3-class":
        num_classes = 3
        class_names = ["Adenocarcinoma (ADC)", "Squamous Cell Carcinoma (SCC)", "Small Cell Lung Carcinoma (SCLC)"]
        base_weights = os.path.join(WEIGHTS_DIR, "baseline_3-class.pth")
        cbam_weights = os.path.join(WEIGHTS_DIR, "attention_cbam_3-class.pth")
    else:
        num_classes = 4
        class_names = ["Adenocarcinoma (ADC)", "Squamous Cell Carcinoma (SCC)", "Small Cell Lung Carcinoma (SCLC)", "Large Cell Carcinoma (LCC)"]
        base_weights = os.path.join(WEIGHTS_DIR, "baseline_4-class.pth")
        cbam_weights = os.path.join(WEIGHTS_DIR, "attention_cbam_4-class.pth")

    test_dataset = LungCTDataset(MANIFEST_FILE, SPLIT_FILE, split_type="test", schema_mode=schema_mode)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

    # 1. Baseline Model
    model_base = BaselineCNN(num_classes=num_classes, pretrained=False).to(device)
    if os.path.exists(base_weights):
        model_base.load_state_dict(torch.load(base_weights, map_location=device))
        print(f"Loaded baseline weights: {base_weights}")
    else:
        print(f"Warning: Baseline weights not found at {base_weights}, evaluating initialized model.")

    y_true_base, y_pred_base = evaluate_model(model_base, test_loader, device)
    metrics_base = compute_classification_metrics(y_true_base, y_pred_base, class_names)

    # 2. CBAM Attention Model
    model_cbam = AttentionCNN(num_classes=num_classes, pretrained=False).to(device)
    if os.path.exists(cbam_weights):
        model_cbam.load_state_dict(torch.load(cbam_weights, map_location=device))
        print(f"Loaded CBAM weights: {cbam_weights}")
    else:
        print(f"Warning: CBAM weights not found at {cbam_weights}, evaluating initialized model.")

    y_true_cbam, y_pred_cbam = evaluate_model(model_cbam, test_loader, device)
    metrics_cbam = compute_classification_metrics(y_true_cbam, y_pred_cbam, class_names)

    # Save JSON artifacts
    base_json_path = os.path.join(RESULTS_DIR, f"baseline_metrics_{schema_mode}.json")
    cbam_json_path = os.path.join(RESULTS_DIR, f"cbam_metrics_{schema_mode}.json")

    with open(base_json_path, "w") as f:
        json.dump(metrics_base, f, indent=2)
    with open(cbam_json_path, "w") as f:
        json.dump(metrics_cbam, f, indent=2)

    print(f"Saved baseline metrics JSON: {base_json_path}")
    print(f"Saved CBAM metrics JSON: {cbam_json_path}")

    # Plot Confusion Matrices
    plot_confusion_matrix(
        np.array(metrics_base["confusion_matrix"]),
        class_names,
        f"Confusion Matrix: Baseline ResNet-18 ({schema_mode.upper()})",
        os.path.join(CM_DIR, f"baseline_cm_{schema_mode}.png")
    )
    plot_confusion_matrix(
        np.array(metrics_cbam["confusion_matrix"]),
        class_names,
        f"Confusion Matrix: ResNet-18 + CBAM Attention ({schema_mode.upper()})",
        os.path.join(CM_DIR, f"cbam_cm_{schema_mode}.png")
    )

    # Plot Metric Comparison if 3-class
    if schema_mode == "3-class":
        plot_metric_comparison(
            metrics_base,
            metrics_cbam,
            os.path.join(EXPERIMENTS_DIR, "baseline_vs_cbam_comparison.png")
        )

    return metrics_base, metrics_cbam

if __name__ == "__main__":
    run_evaluation_pipeline("3-class")
    run_evaluation_pipeline("4-class")
