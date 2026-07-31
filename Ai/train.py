"""
DermaVision Model Training Module
=================================
Orchestrates two-stage model training for skin disease classification.
Stage 1: Frozen backbone, training classification head.
Stage 2: Backbone unfreezing and fine-tuning with AdamW (learning_rate=1e-4).
Manages callbacks, class weights, history plotting, and model persistence.
"""

import json
import logging
import matplotlib.pyplot as plt
from pathlib import Path
import numpy as np
import tensorflow as tf

from config import Config
from dataloader import load_datasets
from model import build_model, prepare_model_for_finetuning

# Configure training-specific logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("DermaVisionTrain")


def plot_and_save_history(history_dict: dict, output_path: Path) -> None:
    """
    Plots training and validation loss and accuracy curves and saves the chart.
    
    Args:
        history_dict (dict): Dictionary containing history metrics.
        output_path (Path): Path to save the output PNG file.
    """
    epochs = range(1, len(history_dict["loss"]) + 1)
    
    plt.figure(figsize=(12, 5))
    
    # 1. Loss Curve
    plt.subplot(1, 2, 1)
    plt.plot(epochs, history_dict["loss"], label="Train Loss", color="#d32f2f", lw=2)
    if "val_loss" in history_dict:
        plt.plot(epochs, history_dict["val_loss"], label="Val Loss", color="#1976d2", lw=2, linestyle="--")
    plt.title("Training & Validation Loss")
    plt.xlabel("Epochs")
    plt.ylabel("Loss")
    plt.grid(True, alpha=0.3)
    plt.legend()
    
    # 2. Accuracy Curve
    plt.subplot(1, 2, 2)
    plt.plot(epochs, history_dict["accuracy"], label="Train Acc", color="#388e3c", lw=2)
    if "val_accuracy" in history_dict:
        plt.plot(epochs, history_dict["val_accuracy"], label="Val Acc", color="#fbc02d", lw=2, linestyle="--")
    plt.title("Training & Validation Accuracy")
    plt.xlabel("Epochs")
    plt.ylabel("Accuracy")
    plt.grid(True, alpha=0.3)
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()
    logger.info(f"Training history visualization saved to {output_path}")


def focal_loss(gamma=2.0, alpha=0.25):
    """
    Focal Loss for multi-class classification.
    Dramatically reduces the loss contribution from easy/majority-class examples
    so the model focuses on hard, minority-class samples.
    gamma=2.0 is a standard choice; alpha=0.25 down-weights majority class.
    """
    def focal_loss_fn(y_true, y_pred):
        epsilon = tf.keras.backend.epsilon()
        y_pred = tf.clip_by_value(y_pred, epsilon, 1.0 - epsilon)
        cross_entropy = -y_true * tf.math.log(y_pred)
        weight = alpha * y_true * tf.math.pow(1.0 - y_pred, gamma)
        loss = weight * cross_entropy
        return tf.reduce_mean(tf.reduce_sum(loss, axis=-1))
    return focal_loss_fn


def train_model() -> None:
    """
    Main orchestrator for training the DermaVision classifier.
    Loads configurations, datasets, builds and trains model, saves outputs.
    """
    # 1. Initialize configuration and seeds
    config = Config()
    config.save_to_yaml(str(config.models_dir / "config.yaml"))
    
    # 2. Load Datasets and Class Weights
    train_ds, val_ds, test_ds, class_weights, class_names = load_datasets(config)
    num_classes = len(class_names)
    
    # 3. Instantiate base model architecture
    model = build_model(num_classes=num_classes, dropout_rate=config.DROPOUT_RATE, img_size=config.IMG_SIZE)
    
    # Write initial model summary to output directory
    summary_path = config.outputs_dir / "model_summary.txt"
    with open(summary_path, "w") as f:
        model.summary(print_fn=lambda line: f.write(line + "\n"))
    logger.info(f"Model architecture summary saved to {summary_path}")

    # 4. Stage 1: Train classifier head only (backbone frozen)
    logger.info("Starting Stage 1: Classifier Head Training...")
    logger.info(f"  Epochs: {config.EPOCHS_STAGE1}, LR: {config.LEARNING_RATE_STAGE1}")
    
    # Use legacy Adam on Apple Silicon to avoid slow AdamW warning
    model.compile(
        optimizer=tf.keras.optimizers.legacy.Adam(learning_rate=config.LEARNING_RATE_STAGE1),
        loss=focal_loss(gamma=2.0, alpha=0.25),
        metrics=["accuracy"]
    )
    
    callbacks_stage1 = [
        # patience=5 so we don't stop before head actually learns
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            mode="max",
            verbose=1
        ),
        tf.keras.callbacks.TensorBoard(
            log_dir=str(config.logs_dir / "stage1"),
            histogram_freq=0
        )
    ]
    
    history_s1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=config.EPOCHS_STAGE1,
        class_weight=class_weights,
        callbacks=callbacks_stage1
    )
    
    # 5. Stage 2: Fine-tune backbone upper layers
    logger.info("Starting Stage 2: Backbone Fine-Tuning...")
    logger.info(f"  Epochs: {config.EPOCHS_STAGE2}, LR: {config.LEARNING_RATE_STAGE2}")
    
    model = prepare_model_for_finetuning(model, num_layers_to_unfreeze=100)
    
    # Use legacy Adam on Apple Silicon for stage 2 fine-tuning
    model.compile(
        optimizer=tf.keras.optimizers.legacy.Adam(
            learning_rate=config.LEARNING_RATE_STAGE2
        ),
        loss=focal_loss(gamma=2.0, alpha=0.25),
        metrics=["accuracy"]
    )
    
    best_model_path = config.models_dir / "best_model.keras"
    callbacks_stage2 = [
        # Save best model by val_accuracy (not val_loss — focal loss scale differs)
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(best_model_path),
            monitor="val_accuracy",
            save_best_only=True,
            mode="max",
            verbose=1
        ),
        # patience=8 gives enough time to escape local minima
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=8,
            restore_best_weights=True,
            mode="max",
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_accuracy",
            factor=0.3,
            patience=4,
            min_lr=1e-7,
            mode="max",
            verbose=1
        ),
        tf.keras.callbacks.TensorBoard(
            log_dir=str(config.logs_dir / "stage2"),
            histogram_freq=0
        )
    ]
    
    history_s2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=config.EPOCHS_STAGE1 + config.EPOCHS_STAGE2,
        initial_epoch=len(history_s1.epoch),
        class_weight=class_weights,
        callbacks=callbacks_stage2
    )

    # 6. Save final model
    final_model_path = config.models_dir / "final_model.keras"
    model.save(str(final_model_path))
    logger.info(f"Final model saved to {final_model_path}")
    
    # 7. Consolidate and save training histories
    h1 = history_s1.history
    h2 = history_s2.history
    
    combined_history = {}
    for metric in h1.keys():
        if metric in h2:
            combined_history[metric] = [float(v) for v in (h1[metric] + h2[metric])]
        else:
            combined_history[metric] = [float(v) for v in h1[metric]]
            
    history_json_path = config.outputs_dir / "training_history.json"
    with open(history_json_path, "w") as f:
        json.dump(combined_history, f, indent=4)
    logger.info(f"Training history saved to {history_json_path}")
    
    plot_and_save_history(combined_history, config.outputs_dir / "training_history.png")
    
    # Report best validation accuracy achieved
    all_val_acc = combined_history.get("val_accuracy", [])
    if all_val_acc:
        logger.info(f"Best val_accuracy achieved: {max(all_val_acc)*100:.1f}% at epoch {all_val_acc.index(max(all_val_acc))+1}")
    logger.info("Training complete.")



if __name__ == "__main__":
    train_model()
