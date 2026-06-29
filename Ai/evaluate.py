"""
DermaVision Model Evaluation Module
===================================
Evaluates the best trained model on the test dataset. Generates accuracy,
precision, recall, F1, per-class accuracy, confusion matrix heatmap, and ROC-AUC scores.
Saves all evaluation summaries in the outputs/ directory.
"""

import json
import logging
from pathlib import Path
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

from config import Config
from dataloader import load_datasets

# Configure logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("DermaVisionEvaluate")


def evaluate_model() -> None:
    """
    Loads the best trained model checkpoint, runs inference on the test set,
    calculates metrics, plots and saves the confusion matrix and report text.
    """
    config = Config()
    
    # 1. Load datasets
    logger.info("Loading test dataset for evaluation...")
    _, _, test_ds, _, class_names = load_datasets(config)
    num_classes = len(class_names)
    
    # 2. Load best model checkpoint
    best_model_path = config.models_dir / "best_model.keras"
    if not best_model_path.exists():
        logger.warning("best_model.keras not found, falling back to final_model.keras")
        best_model_path = config.models_dir / "final_model.keras"
        
    if not best_model_path.exists():
        raise FileNotFoundError("No trained model checkpoints found in models directory.")
        
    logger.info(f"Loading trained weights from {best_model_path}...")
    model = tf.keras.models.load_model(str(best_model_path))
    
    # 3. Accumulate test set predictions and true labels
    logger.info("Running evaluation predictions on test dataset...")
    y_true_onehot = []
    y_pred_probs = []
    
    for images, labels in test_ds:
        probs = model.predict(images, verbose=0)
        y_true_onehot.append(labels.numpy())
        y_pred_probs.append(probs)
        
    y_true_onehot = np.concatenate(y_true_onehot, axis=0)
    y_pred_probs = np.concatenate(y_pred_probs, axis=0)
    
    y_true = np.argmax(y_true_onehot, axis=1)
    y_pred = np.argmax(y_pred_probs, axis=1)
    
    # 4. Compute Metrics
    logger.info("Computing evaluation metrics...")
    
    # Overall Accuracy
    accuracy = accuracy_score(y_true, y_pred)
    
    # Weighted Precision, Recall, F1-Score
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="weighted")
    
    # Standard Classification Report
    report = classification_report(y_true, y_pred, target_names=class_names, zero_division=0)
    
    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    
    # Per-Class Accuracy
    per_class_acc = {}
    for idx, class_name in enumerate(class_names):
        class_indices = np.where(y_true == idx)[0]
        if len(class_indices) > 0:
            correct_class_preds = np.sum(y_pred[class_indices] == idx)
            class_acc = correct_class_preds / len(class_indices)
            per_class_acc[class_name] = float(class_acc)
        else:
            per_class_acc[class_name] = 0.0
            
    # Multi-Class ROC-AUC
    # Handle class presence dynamically to prevent errors if some classes are missing in test set
    unique_classes_present = np.unique(y_true)
    if len(unique_classes_present) < num_classes:
        logger.warning(
            f"Only {len(unique_classes_present)} out of {num_classes} classes are present in the test subset. "
            "Computing ROC-AUC on present classes only."
        )
        try:
            roc_auc = roc_auc_score(
                y_true_onehot[:, unique_classes_present],
                y_pred_probs[:, unique_classes_present],
                multi_class="ovr",
                average="weighted"
            )
        except Exception as e:
            logger.error(f"Failed to calculate ROC-AUC: {e}")
            roc_auc = 0.0
    else:
        try:
            roc_auc = roc_auc_score(
                y_true_onehot,
                y_pred_probs,
                multi_class="ovr",
                average="weighted"
            )
        except Exception as e:
            logger.error(f"Failed to calculate ROC-AUC: {e}")
            roc_auc = 0.0

    # 5. Save classification report to text file
    report_path = config.outputs_dir / "classification_report.txt"
    with open(report_path, "w") as f:
        f.write("=== DERMAVISION MODEL EVALUATION ===\n\n")
        f.write(f"Model Evaluated: {best_model_path.name}\n")
        f.write(f"Overall Accuracy: {accuracy * 100:.2f}%\n")
        f.write(f"Weighted Precision: {precision * 100:.2f}%\n")
        f.write(f"Weighted Recall: {recall * 100:.2f}%\n")
        f.write(f"Weighted F1-Score: {f1 * 100:.2f}%\n")
        f.write(f"Weighted Multi-Class ROC-AUC (OVR): {roc_auc * 100:.2f}%\n\n")
        f.write("--- Classification Report ---\n")
        f.write(report)
        f.write("\n--- Per-Class Accuracy ---\n")
        for cls_name, cls_acc in per_class_acc.items():
            f.write(f"{cls_name}: {cls_acc * 100:.2f}%\n")
            
    logger.info(f"Classification report saved to {report_path}")
    
    # 6. Plot and save Confusion Matrix Heatmap
    plt.figure(figsize=(15, 12))
    # Normalize confusion matrix by row (true labels count)
    cm_normalized = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    cm_normalized = np.nan_to_num(cm_normalized) # Replace nan with 0.0
    
    sns.heatmap(
        cm_normalized,
        annot=True,
        fmt=".2f",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        cbar=True,
        annot_kws={"size": 8}
    )
    plt.title("Normalized Confusion Matrix Heatmap")
    plt.xlabel("Predicted Disease Class")
    plt.ylabel("True Disease Class")
    plt.xticks(rotation=45, ha="right", fontsize=8)
    plt.yticks(rotation=0, fontsize=8)
    plt.tight_layout()
    
    cm_path = config.outputs_dir / "confusion_matrix.png"
    plt.savefig(cm_path, dpi=150)
    plt.close()
    logger.info(f"Confusion matrix plot saved to {cm_path}")
    
    # Write summary metrics JSON
    metrics_summary = {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "roc_auc": float(roc_auc),
        "per_class_accuracy": per_class_acc
    }
    metrics_json_path = config.outputs_dir / "metrics_summary.json"
    with open(metrics_json_path, "w") as f:
        json.dump(metrics_summary, f, indent=4)
        
    logger.info(f"Metrics summary JSON saved to {metrics_json_path}")


if __name__ == "__main__":
    evaluate_model()
