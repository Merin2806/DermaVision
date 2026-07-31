"""
DermaVision Prediction Debugger
================================
Run this to see the raw probability scores from the model for any image.
This reveals whether the model is predicting randomly (all ~4%) or has a bias.

Usage:
    cd DermaVision/Ai
    python debug_prediction.py /path/to/your/test_image.jpg
"""

import sys
import json
import numpy as np
import tensorflow as tf
from pathlib import Path

# Load class map
models_dir = Path(__file__).parent / "models"
with open(models_dir / "class_indices.json") as f:
    class_to_idx = json.load(f)
idx_to_class = {int(v): k for k, v in class_to_idx.items()}

# Load model
print("Loading model...")
model = tf.keras.models.load_model(str(models_dir / "best_model.keras"), compile=False)
print("Model loaded!\n")

# Load image
if len(sys.argv) < 2:
    print("Usage: python debug_prediction.py <image_path>")
    sys.exit(1)

img_path = sys.argv[1]
img_raw = tf.io.read_file(img_path)
img = tf.image.decode_image(img_raw, channels=3, expand_animations=False)
img = tf.cast(img, tf.float32)
img = tf.image.resize(img, [380, 380], antialias=True)
img_batch = tf.expand_dims(img, axis=0)

print(f"Image shape: {img.shape}")
print(f"Pixel range: min={float(tf.reduce_min(img)):.1f}, max={float(tf.reduce_max(img)):.1f}")
print()

# Predict
preds = model.predict(img_batch, verbose=0)[0]

print("=" * 60)
print("ALL 25 CLASS PROBABILITIES (sorted by confidence):")
print("=" * 60)
sorted_indices = np.argsort(preds)[::-1]
for rank, idx in enumerate(sorted_indices):
    bar = "=" * int(preds[idx] * 50)
    print(f"  #{rank+1:2d} [{idx:2d}] {idx_to_class[idx][:40]:<40} {preds[idx]*100:5.1f}% {bar}")

print()
winner_idx = int(np.argmax(preds))
print(f"PREDICTION: {idx_to_class[winner_idx]} ({preds[winner_idx]*100:.1f}%)")
print()

# Check if model is basically random
max_prob = float(np.max(preds))
if max_prob < 0.10:
    print("WARNING: Model confidence is < 10% -- model is predicting randomly (undertrained)")
elif max_prob < 0.40:
    print("WARNING: Model confidence is low -- model may not have converged well")
else:
    print("OK: Model has reasonable confidence in its top prediction")
