import os
import random
import shutil
from pathlib import Path

# ==========================
# CONFIGURATION
# ==========================

SOURCE_DIR = "dataset"      # Current merged dataset

TRAIN_DIR = "dataset/train"
VAL_DIR = "dataset/val"
TEST_DIR = "dataset/test"

TRAIN_RATIO = 0.80
VAL_RATIO = 0.10
TEST_RATIO = 0.10

random.seed(42)

# ==========================

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

source = Path(SOURCE_DIR)

# Create output folders
for folder in [TRAIN_DIR, VAL_DIR, TEST_DIR]:
    Path(folder).mkdir(parents=True, exist_ok=True)

for disease_folder in source.iterdir():

    if not disease_folder.is_dir():
        continue

    # Skip train/val/test folders if script is run again
    if disease_folder.name.lower() in ["train", "val", "test"]:
        continue

    images = [
        img for img in disease_folder.iterdir()
        if img.suffix.lower() in IMAGE_EXTENSIONS
    ]

    random.shuffle(images)

    total = len(images)

    train_count = int(total * TRAIN_RATIO)
    val_count = int(total * VAL_RATIO)

    train_images = images[:train_count]
    val_images = images[train_count:train_count + val_count]
    test_images = images[train_count + val_count:]

    # Create disease folders
    train_class = Path(TRAIN_DIR) / disease_folder.name
    val_class = Path(VAL_DIR) / disease_folder.name
    test_class = Path(TEST_DIR) / disease_folder.name

    train_class.mkdir(parents=True, exist_ok=True)
    val_class.mkdir(parents=True, exist_ok=True)
    test_class.mkdir(parents=True, exist_ok=True)

    # Copy images
    for img in train_images:
        shutil.copy2(img, train_class / img.name)

    for img in val_images:
        shutil.copy2(img, val_class / img.name)

    for img in test_images:
        shutil.copy2(img, test_class / img.name)

    print(
        f"{disease_folder.name}: "
        f"Train={len(train_images)}, "
        f"Val={len(val_images)}, "
        f"Test={len(test_images)}"
    )

print("\nDataset split completed successfully!")