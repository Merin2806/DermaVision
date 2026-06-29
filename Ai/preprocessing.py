"""
DermaVision Preprocessing Module
================================
Handles image decoding, conversion to RGB, resizing to 380x380, and normalization.
"""

import tensorflow as tf
import logging

logger = logging.getLogger("DermaVisionPreprocessing")


def preprocess_image_tensor(img_tensor: tf.Tensor, img_size: int = 380) -> tf.Tensor:
    """
    Preprocesses an image tensor: converts to float32, resizes, and normalizes to [0, 1].
    
    Args:
        img_tensor (tf.Tensor): Decoded image tensor (uint8).
        img_size (int): Target width and height (380 for EfficientNet-B4).
        
    Returns:
        tf.Tensor: Preprocessed float32 image tensor of shape (img_size, img_size, 3).
    """
    # 1. Cast to float32
    img_tensor = tf.cast(img_tensor, tf.float32)
    
    # 2. Resize image using bilinear interpolation with antialiasing
    img_resized = tf.image.resize(img_tensor, [img_size, img_size], antialias=True)
    
    # 3. Normalize pixel values to range [0.0, 1.0]
    img_normalized = img_resized / 255.0
    
    return img_normalized


def load_and_preprocess_image(image_path: str, img_size: int = 380) -> tf.Tensor:
    """
    Loads an image from a local file path, decodes it as an RGB image,
    resizes it to the target resolution, and normalizes it.
    
    Args:
        image_path (str): Absolute or relative path to the image file.
        img_size (int): Target width and height.
        
    Returns:
        tf.Tensor: Preprocessed float32 image tensor of shape (img_size, img_size, 3).
    """
    # 1. Read the file content
    img_raw = tf.io.read_file(image_path)
    
    # 2. Decode image to tensor
    # channels=3 converts grayscale to RGB and drops alpha channels if any exist
    img_tensor = tf.image.decode_image(img_raw, channels=3, expand_animations=False)
    
    # 3. Process the decoded tensor
    return preprocess_image_tensor(img_tensor, img_size=img_size)
