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

    # 4. Prepare Stage 1 Training (Frozen backbone, training classifier head)
    logger.info("Starting Stage 1: Classifier Head Training...")
    
    # Compile model with standard Adam optimizer for Stage 1 head training
    # Keras 2/TensorFlow 2.15 uses standard Adam optimizer
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=config.LEARNING_RATE_STAGE1),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    # Define Callbacks for Stage 1 (Fast classifier head fitting)
    callbacks_stage1 = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=3,
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.TensorBoard(
            log_dir=str(config.logs_dir / "stage1"),
            histogram_freq=1
        )
    ]
    
    # Fit Stage 1
    history_s1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=config.EPOCHS_STAGE1,
        class_weight=class_weights,
        callbacks=callbacks_stage1
    )
    
    # 5. Prepare Stage 2 Training (Fine-tuning backbone upper layers)
    logger.info("Starting Stage 2: Backbone Fine-Tuning...")
    
    # Unfreeze upper layers of the backbone
    model = prepare_model_for_finetuning(model, num_layers_to_unfreeze=100)
    
    # Recompile model with AdamW optimizer and lower learning rate (1e-4) for stable fine-tuning
    model.compile(
        optimizer=tf.keras.optimizers.AdamW(learning_rate=config.LEARNING_RATE_STAGE2),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    # Define Callbacks for Stage 2
    best_model_path = config.models_dir / "best_model.keras"
    callbacks_stage2 = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(best_model_path),
            monitor="val_loss",
            save_best_only=True,
            verbose=1
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=3,
            verbose=1
        ),
        tf.keras.callbacks.TensorBoard(
            log_dir=str(config.logs_dir / "stage2"),
            histogram_freq=1
        )
    ]
    
    # Fit Stage 2
    # Setting initial_epoch to length of Stage 1 to keep epochs chronological
    history_s2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=config.EPOCHS_STAGE1 + config.EPOCHS_STAGE2,
        initial_epoch=len(history_s1.epoch),
        class_weight=class_weights,
        callbacks=callbacks_stage2
    )

    # 6. Save final model weight checkpoints
    final_model_path = config.models_dir / "final_model.keras"
    model.save(str(final_model_path))
    logger.info(f"Final model version saved to {final_model_path}")
    
    # 7. Consolidate and save training histories
    h1 = history_s1.history
    h2 = history_s2.history
    
    combined_history = {}
    for metric in h1.keys():
        if metric in h2:
            combined_history[metric] = [float(v) for v in (h1[metric] + h2[metric])]
        else:
            combined_history[metric] = [float(v) for v in h1[metric]]
            
    # Serialize history JSON
    history_json_path = config.outputs_dir / "training_history.json"
    with open(history_json_path, "w") as f:
        json.dump(combined_history, f, indent=4)
    logger.info(f"Training history metrics logged to {history_json_path}")
    
    # Plot history loss/accuracy
    plot_and_save_history(combined_history, config.outputs_dir / "training_history.png")
    logger.info("Training complete.")


if __name__ == "__main__":
    train_model()
