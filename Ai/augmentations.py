"""
DermaVision Data Augmentation Module
====================================
Configures Keras preprocessing layers for data augmentation during training.
Applies random horizontal flips, mild rotations, zooms, contrast, and brightness adjustments.
"""

import tensorflow as tf
from tensorflow.keras import layers
import logging

logger = logging.getLogger("DermaVisionAugmentations")


def get_augmentation_pipeline() -> tf.keras.Sequential:
    """
    Constructs a sequential Keras pipeline of allowed data augmentations.
    To be applied only on the training dataset.
    
    Allowed:
        - Random Horizontal Flip
        - Random Rotation ±10% (factor=0.1)
        - Random Zoom 10% (factor=0.1)
        - Random Contrast (factor=0.1)
        - Random Brightness (factor=0.1)
        
    Forbidden:
        - Vertical Flip
        - Heavy Rotation
        - Unrealistic Color Shifts
        
    Returns:
        tf.keras.Sequential: Keras sequential layers for data augmentation.
    """
    logger.info("Constructing Keras Sequential Data Augmentation Pipeline...")
    
    pipeline = tf.keras.Sequential([
        # 1. Random Horizontal Flip (Allowed, vertical flip is NOT allowed)
        layers.RandomFlip(mode="horizontal", name="random_horizontal_flip"),
        
        # 2. Random Rotation ±10% (0.1 factor)
        # Factor represents a range [-10%, +10%] of 2*pi (i.e. up to ±36 degrees)
        layers.RandomRotation(factor=0.1, fill_mode="reflect", name="random_rotation"),
        
        # 3. Random Zoom ±10%
        # Factors represent range of zoom in/out
        layers.RandomZoom(
            height_factor=(-0.1, 0.1),
            width_factor=(-0.1, 0.1),
            fill_mode="reflect",
            name="random_zoom"
        ),
        
        # 4. Random Contrast adjustment (factor=0.1 represents [1 - 0.1, 1 + 0.1] scaling)
        layers.RandomContrast(factor=0.1, name="random_contrast"),
        
        # 5. Random Brightness adjustment (factor=0.1 represents brightness delta up to 10%)
        # Specifying value_range=(0.0, 1.0) because images are normalized to [0, 1] range
        layers.RandomBrightness(factor=0.1, value_range=(0.0, 1.0), name="random_brightness")
    ], name="derma_augmentation_pipeline")
    
    logger.info("Augmentation pipeline successfully constructed.")
    return pipeline
