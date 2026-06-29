"""
DermaVision Configuration Module
================================
Handles random seed initialization for reproducibility, hardware device detection
(CPU, GPU, Apple Silicon MPS), directory verification, and YAML configuration loading/saving.
"""

import os
import random
import logging
from pathlib import Path
from typing import Dict, Any
import yaml
import numpy as np
import tensorflow as tf

# Setup configuration-specific logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("DermaVisionConfig")

# Base directories resolved relative to this config file
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DATASET_DIR = BASE_DIR / "dataset"
DEFAULT_MODELS_DIR = BASE_DIR / "models"
DEFAULT_OUTPUTS_DIR = BASE_DIR / "outputs"
DEFAULT_LOGS_DIR = BASE_DIR / "logs"


class Config:
    """
    Configuration manager for the DermaVision AI model training and inference.
    """

    # Global Random Seed for Reproducibility
    SEED: int = 42

    # Model Input Details (EfficientNet-B4 standard input resolution)
    IMG_SIZE: int = 380
    CHANNELS: int = 3

    # Hyperparameters
    BATCH_SIZE: int = 16
    EPOCHS_STAGE1: int = 10           # Head classifier training
    EPOCHS_STAGE2: int = 20           # Backbone fine-tuning
    LEARNING_RATE_STAGE1: float = 1e-3
    LEARNING_RATE_STAGE2: float = 1e-4
    DROPOUT_RATE: float = 0.4

    # Future-Ready Placeholder Flags (not to be implemented yet)
    FUTURE_SEVERITY_ENABLED: bool = False
    FUTURE_SEGMENTATION_ENABLED: bool = False
    FUTURE_VLM_ENABLED: bool = False

    def __init__(self, config_path: str = None) -> None:
        """
        Initializes configuration directories, detects available hardware devices,
        and sets random seeds for reproducibility.
        
        Args:
            config_path (str, optional): Path to a custom YAML configuration file.
        """
        self.dataset_dir = DEFAULT_DATASET_DIR
        self.models_dir = DEFAULT_MODELS_DIR
        self.outputs_dir = DEFAULT_OUTPUTS_DIR
        self.logs_dir = DEFAULT_LOGS_DIR

        # Create directories if they do not exist
        for directory in [self.dataset_dir, self.models_dir, self.outputs_dir, self.logs_dir]:
            directory.mkdir(parents=True, exist_ok=True)

        # Load from user-supplied yaml, or try loading existing config.yaml in models directory
        if config_path and os.path.exists(config_path):
            self.load_from_yaml(config_path)
        else:
            default_yaml = self.models_dir / "config.yaml"
            if default_yaml.exists():
                self.load_from_yaml(str(default_yaml))

        # Set seeds across all random libraries
        self.set_seed()

        # Perform hardware auto-detection
        self.device = self.detect_device()

    def set_seed(self) -> None:
        """
        Enforces random seeds across Python, NumPy, and TensorFlow to guarantee
        reproducible operations and dataset shuffles.
        """
        random.seed(self.SEED)
        np.random.seed(self.SEED)
        tf.random.set_seed(self.SEED)
        
        # Additional settings for TensorFlow deterministic behavior
        os.environ['PYTHONHASHSEED'] = str(self.SEED)
        
        # Configure CPU/GPU/MPS determinism
        tf.config.experimental.enable_op_determinism()
        logger.info(f"Deterministic seed {self.SEED} successfully applied.")

    def detect_device(self) -> str:
        """
        Detects GPU acceleration, supporting NVIDIA GPUs (CUDA) and Apple Silicon GPUs (MPS).
        
        Returns:
            str: "GPU" or "CPU" depending on hardware availability.
        """
        # In TensorFlow 2.15 on Apple Silicon or Linux/Windows,
        # list_physical_devices('GPU') returns PluggableDevices (e.g. metal on mac) as well as CUDA devices.
        gpus = tf.config.list_physical_devices('GPU')
        if gpus:
            logger.info(f"GPU hardware acceleration detected: {gpus}")
            return "GPU"
        else:
            logger.info("No GPU detected. Training and inference will run on CPU.")
            return "CPU"

    def load_from_yaml(self, path: str) -> None:
        """
        Overrides defaults from a YAML configuration file.
        
        Args:
            path (str): Path to YAML config file.
        """
        try:
            with open(path, "r") as f:
                overrides = yaml.safe_load(f)
                if overrides:
                    for key, val in overrides.items():
                        if hasattr(self, key):
                            setattr(self, key, val)
                    logger.info(f"Loaded config overrides from {path}")
        except Exception as e:
            logger.error(f"Failed to load config from {path}: {e}")

    def save_to_yaml(self, path: str) -> None:
        """
        Persists the current configuration parameters to a YAML file.
        
        Args:
            path (str): Target write path.
        """
        data = {
            "SEED": self.SEED,
            "IMG_SIZE": self.IMG_SIZE,
            "CHANNELS": self.CHANNELS,
            "BATCH_SIZE": self.BATCH_SIZE,
            "EPOCHS_STAGE1": self.EPOCHS_STAGE1,
            "EPOCHS_STAGE2": self.EPOCHS_STAGE2,
            "LEARNING_RATE_STAGE1": self.LEARNING_RATE_STAGE1,
            "LEARNING_RATE_STAGE2": self.LEARNING_RATE_STAGE2,
            "DROPOUT_RATE": self.DROPOUT_RATE,
            "FUTURE_SEVERITY_ENABLED": self.FUTURE_SEVERITY_ENABLED,
            "FUTURE_SEGMENTATION_ENABLED": self.FUTURE_SEGMENTATION_ENABLED,
            "FUTURE_VLM_ENABLED": self.FUTURE_VLM_ENABLED,
        }
        try:
            with open(path, "w") as f:
                yaml.safe_dump(data, f)
                logger.info(f"Config successfully serialized to {path}")
        except Exception as e:
            logger.error(f"Failed to serialize config to {path}: {e}")


if __name__ == "__main__":
    # Self-test to verify configuration setup
    config = Config()
    print("Detected device:", config.device)
    print("Dataset directory:", config.dataset_dir)
