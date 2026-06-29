"""
DermaVision Dataset Loader Module
=================================
Discovers dataset directories, maps class names alphabetically, computes
class weights to resolve imbalances, and returns optimized tf.data.Dataset loaders
for train, validation, and test sets.
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Any

import numpy as np
import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight

from config import Config
from preprocessing import preprocess_image_tensor
from augmentations import get_augmentation_pipeline

logger = logging.getLogger("DermaVisionDataloader")

# Supported image suffixes
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def get_image_paths_and_labels(directory: Path, class_to_idx: Dict[str, int]) -> Tuple[List[str], List[int]]:
    """
    Scans a directory for images and assigns their numerical label indices.
    
    Args:
        directory (Path): Path to dataset subset (train/val/test).
        class_to_idx (Dict[str, int]): Class name to index mapping dictionary.
        
    Returns:
        Tuple[List[str], List[int]]: Lists of image file paths and corresponding labels.
    """
    paths = []
    labels = []
    
    for class_name in class_to_idx.keys():
        class_dir = directory / class_name
        if not class_dir.exists():
            logger.warning(f"Class folder {class_dir} not found in subset directory.")
            continue
            
        for file in class_dir.iterdir():
            if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS:
                paths.append(str(file))
                labels.append(class_to_idx[class_name])
                
    return paths, labels


def load_and_preprocess_from_path(path: tf.Tensor, label: tf.Tensor, img_size: int) -> Tuple[tf.Tensor, tf.Tensor]:
    """
    TensorFlow graph-compatible loader function. Reads, decodes, and preprocesses
    an image from a file path tensor.
    
    Args:
        path (tf.Tensor): File path string tensor.
        label (tf.Tensor): Label tensor.
        img_size (int): Image size to resize to.
        
    Returns:
        Tuple[tf.Tensor, tf.Tensor]: Preprocessed image tensor and label tensor.
    """
    # Read raw file bytes
    img_raw = tf.io.read_file(path)
    
    # Decode image to tensor
    # channels=3 converts grayscale to RGB and drops alpha channels
    img_tensor = tf.image.decode_image(img_raw, channels=3, expand_animations=False)
    
    # Normalize and resize using the preprocessing module function
    img_preprocessed = preprocess_image_tensor(img_tensor, img_size=img_size)
    
    return img_preprocessed, label


def build_dataset(
    paths: List[str],
    labels: List[int],
    num_classes: int,
    config: Config,
    is_training: bool = False
) -> tf.data.Dataset:
    """
    Constructs a highly performant tf.data.Dataset pipeline.
    
    Args:
        paths (List[str]): List of image file paths.
        labels (List[int]): List of image label indices.
        num_classes (int): Total number of distinct disease classes.
        config (Config): Project configuration instance.
        is_training (bool): If True, applies shuffle and data augmentation.
        
    Returns:
        tf.data.Dataset: Fully configured, prefetched dataset pipeline.
    """
    # 1. Create dataset from file path strings and integer labels
    paths_tensor = tf.constant(paths, dtype=tf.string)
    labels_tensor = tf.constant(labels, dtype=tf.int32)
    
    # Map labels to one-hot encoding
    one_hot_labels = tf.one_hot(labels_tensor, depth=num_classes)
    
    dataset = tf.data.Dataset.from_tensor_slices((paths_tensor, one_hot_labels))
    
    # 2. Shuffle paths early during training before file loading to optimize IO patterns
    if is_training:
        dataset = dataset.shuffle(buffer_size=len(paths), seed=config.SEED, reshuffle_each_iteration=True)
    
    # 3. Map file loading and preprocessing (multithreaded reading)
    dataset = dataset.map(
        lambda path, label: load_and_preprocess_from_path(path, label, config.IMG_SIZE),
        num_parallel_calls=tf.data.AUTOTUNE
    )
    
    # 4. Batch the inputs
    dataset = dataset.batch(config.BATCH_SIZE)
    
    # 5. Apply training-only augmentations over batched tensor inputs (faster on CPU/GPU)
    if is_training:
        augmentation_pipeline = get_augmentation_pipeline()
        dataset = dataset.map(
            lambda x, y: (augmentation_pipeline(x, training=True), y),
            num_parallel_calls=tf.data.AUTOTUNE
        )
    
    # 6. Enable prefetching to overlap data loading with GPU computation
    dataset = dataset.prefetch(buffer_size=tf.data.AUTOTUNE)
    
    return dataset


def load_datasets(config: Config) -> Tuple[tf.data.Dataset, tf.data.Dataset, tf.data.Dataset, Dict[int, float], List[str]]:
    """
    Orchestrates dataset discovery, class indexing, class weight calculations, 
    and builds train, val, and test datasets.
    
    Args:
        config (Config): Project configuration.
        
    Returns:
        Tuple:
            - train_dataset (tf.data.Dataset)
            - val_dataset (tf.data.Dataset)
            - test_dataset (tf.data.Dataset)
            - class_weights_dict (Dict[int, float]): Dictionary mapping class index to weight multiplier.
            - class_names (List[str]): List of class names sorted alphabetically.
    """
    train_dir = config.dataset_dir / "train"
    val_dir = config.dataset_dir / "val"
    test_dir = config.dataset_dir / "test"

    # Discover and sort classes alphabetically to ensure stable index mapping
    class_names = sorted([d.name for d in train_dir.iterdir() if d.is_dir()])
    
    if len(class_names) == 0:
        raise FileNotFoundError(f"No class folders found in train directory: {train_dir}")
        
    logger.info(f"Discovered {len(class_names)} skin condition classes.")
    
    class_to_idx = {name: idx for idx, name in enumerate(class_names)}
    
    # Save class indices json to models folder for inference mapping
    class_indices_path = config.models_dir / "class_indices.json"
    with open(class_indices_path, "w") as f:
        json.dump(class_to_idx, f, indent=4)
    logger.info(f"Saved class index maps to {class_indices_path}")

    # Load paths and numerical labels
    train_paths, train_labels = get_image_paths_and_labels(train_dir, class_to_idx)
    val_paths, val_labels = get_image_paths_and_labels(val_dir, class_to_idx)
    test_paths, test_labels = get_image_paths_and_labels(test_dir, class_to_idx)
    
    logger.info(f"Dataset Counts: Train={len(train_paths)}, Val={len(val_paths)}, Test={len(test_paths)}")

    # Compute class weights using sklearn.compute_class_weight to handle class imbalances
    unique_classes = np.unique(train_labels)
    class_weights = compute_class_weight(
        class_weight="balanced",
        classes=unique_classes,
        y=train_labels
    )
    
    # Map computed weights to dictionary matching the target class index mapping
    class_weights_dict = {int(idx): float(weight) for idx, weight in zip(unique_classes, class_weights)}
    
    # Fill in weights for missing labels if any to avoid errors during training config mapping
    for i in range(len(class_names)):
        if i not in class_weights_dict:
            class_weights_dict[i] = 1.0
            
    logger.info(f"Class weight adjustment factors computed: {class_weights_dict}")

    # Build optimized datasets
    train_dataset = build_dataset(train_paths, train_labels, len(class_names), config, is_training=True)
    val_dataset = build_dataset(val_paths, val_labels, len(class_names), config, is_training=False)
    test_dataset = build_dataset(test_paths, test_labels, len(class_names), config, is_training=False)

    return train_dataset, val_dataset, test_dataset, class_weights_dict, class_names


if __name__ == "__main__":
    # Test script loading to verify dataset pipeline structure
    cfg = Config()
    try:
        tr_ds, val_ds, ts_ds, weights, classes = load_datasets(cfg)
        print("Success! Classes discovered:", classes)
        print("First batch image shapes:")
        for x, y in tr_ds.take(1):
            print("Images shape:", x.shape)
            print("Labels shape (one-hot):", y.shape)
    except Exception as err:
        print("Error during dataloader test run:", err)
