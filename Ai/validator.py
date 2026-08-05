"""
DermaVision Pre-Screening Image Validator
=========================================
Independent, lightweight image validation layer using torchvision's pretrained ResNet50.
Validates whether uploaded images contain human body/skin before invoking disease prediction models.
"""

import io
import logging
from pathlib import Path
from typing import List, Dict, Tuple, Union

from PIL import Image
import torch
import torch.nn.functional as F
from torchvision.models import resnet50, ResNet50_Weights

# Setup logger for the validator module
logger = logging.getLogger("DermaVisionValidator")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")


class ImageValidator:
    """
    Validates uploaded scan images against ImageNet categories using ResNet50.
    Identifies non-skin/non-human objects (laptops, furniture, pets, etc.) and flags them as invalid.
    """

    def __init__(self):
        logger.info("Initializing torchvision ResNet50 Image Validation Model...")
        self.weights = ResNet50_Weights.DEFAULT
        self.model = resnet50(weights=self.weights)
        self.model.eval()
        self.preprocess = self.weights.transforms()
        self.categories: List[str] = self.weights.meta.get("categories", [])

        # BLOCK-LIST: Keywords for non-skin / non-human categories
        self.block_keywords = [
            # Office / Electronics / Computers
            "book", "notebook", "binder", "envelope", "menu", "paper", "document",
            "monitor", "screen", "laptop", "keyboard", "mouse", "television", "tv",
            "desktop computer", "hand-held computer", "cellular telephone", "phone",
            "cellphone", "radiator", "modem", "printer", "typewriter",
            # Furniture
            "dining table", "table", "desk", "chair", "stool", "sofa", "couch", "bed", "bookcase",
            # Household / Container objects
            "bottle", "water bottle", "pop bottle", "wine bottle", "cup", "mug", "pitcher",
            "can", "bucket", "glass", "bowl", "plate", "crate", "carton", "vase",
            # Vehicles & Structures
            "car", "vehicle", "automobile", "sports car", "convertible", "truck", "bus",
            "bicycle", "motorcycle", "train", "airplane", "ship", "boat",
            "building", "house", "church", "tower", "palace", "monastery", "dock", "castle", "bridge",
            # Animals
            "dog", "cat", "bird", "reptile", "snake", "frog", "lizard", "spider", "bear",
            "elephant", "horse", "cow", "sheep", "pig", "fish", "hamster", "rabbit",
            # Food & Plants
            "food", "pizza", "sandwich", "fruit", "vegetable", "bread", "cake", "cheeseburger",
            "hotdog", "apple", "banana", "orange", "broccoli", "mushroom", "flower", "daisy",
            "rose", "sunflower", "plant", "tree", "leaf"
        ]

        # ALLOW-LIST: Keywords for human body, skin, face, clothing, and clinical items
        self.allow_keywords = [
            "person", "face", "hand", "arm", "leg", "foot", "human", "body", "skin",
            "groom", "bride", "jersey", "t-shirt", "shirt", "suit", "bikini", "maillot",
            "swimsuit", "diaper", "band_aid", "bandage", "stethoscope", "mask", "pajama",
            "poncho", "trench coat", "sarong", "scuba diver", "wig", "necktie", "bow tie",
            "cardigan", "sweater", "brassiere", "bra", "kimono", "pajamas", "stretcher",
            "clothespin", "lipstick", "sunglasses", "sunhat", "sweatshirt", "gown", "apron",
            "volleyball", "headband"
        ]

    def validate_image(self, image_input: Union[str, Path, bytes, Image.Image]) -> Tuple[bool, List[Dict[str, float]], str]:
        """
        Validates an uploaded image.

        Args:
            image_input: File path (str/Path), image bytes, or PIL Image instance.

        Returns:
            Tuple[bool, List[Dict[str, float]], str]:
                - is_valid (bool): True if image appears to be human/skin related, False if blocked.
                - top5_predictions (List[Dict]): Top 5 ImageNet predictions with label & probability.
                - message (str): Explanation message.
        """
        try:
            if isinstance(image_input, (str, Path)):
                img = Image.open(image_input).convert("RGB")
            elif isinstance(image_input, bytes):
                img = Image.open(io.BytesIO(image_input)).convert("RGB")
            elif isinstance(image_input, Image.Image):
                img = image_input.convert("RGB")
            else:
                raise ValueError(f"Unsupported image input type: {type(image_input)}")
        except Exception as err:
            logger.error(f"Failed to open image for validation: {err}")
            return False, [], "Invalid image file or format."

        # Preprocess and obtain tensor batch
        batch = self.preprocess(img).unsqueeze(0)

        # Inference under no_grad
        with torch.no_grad():
            outputs = self.model(batch)
            probabilities = F.softmax(outputs[0], dim=0)

        # Retrieve top 5 predictions
        top5_probs, top5_indices = torch.topk(probabilities, 5)

        top5_predictions = []
        for i in range(5):
            idx = top5_indices[i].item()
            prob = top5_probs[i].item()
            label = self.categories[idx] if idx < len(self.categories) else f"category_{idx}"
            top5_predictions.append({"label": label, "probability": prob})

        # Format and output required logging (Requirement 11)
        log_lines = ["ImageNet Top-5 Predictions:"]
        for rank, pred in enumerate(top5_predictions, 1):
            percent = round(pred["probability"] * 100)
            log_lines.append(f"{rank}. {pred['label']} ({percent}%)")
        logger.info("\n".join(log_lines))

        # Highest (Top-1) prediction
        top1_pred = top5_predictions[0]
        top1_label = top1_pred["label"].lower()

        # Check against block list and allow list
        is_blocked = any(kw in top1_label for kw in self.block_keywords)
        is_allowed = any(kw in top1_label for kw in self.allow_keywords)

        # Additional check: If Top-1 is not explicitly allowed, check if any blocked keyword appears in top 3
        top3_blocked = any(
            any(kw in pred["label"].lower() for kw in self.block_keywords)
            for pred in top5_predictions[:3]
        )

        if is_blocked or (not is_allowed and top3_blocked):
            logger.warning(f"Image validation FAILED: Top prediction '{top1_label}' matched block list or non-skin category.")
            return False, top5_predictions, "Invalid image. Please upload a clear image of the affected human skin."

        logger.info(f"Image validation PASSED: Top prediction '{top1_label}' is acceptable.")
        return True, top5_predictions, "Image validated successfully."


if __name__ == "__main__":
    import sys
    print("=== Testing DermaVision Image Validator ===")
    validator = ImageValidator()
    print("Validator model initialized successfully!")
    
    if len(sys.argv) > 1:
        test_file = sys.argv[1]
        print(f"\nValidating image: {test_file}")
        valid, preds, msg = validator.validate_image(test_file)
        print(f"Validation Outcome: {'VALID (PASS)' if valid else 'INVALID (BLOCK)'}")
        print(f"Message: {msg}")
    else:
        print("\nValidator is ready. Pass an image path to test: python validator.py <image_path>")

