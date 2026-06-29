"""
DermaVision Inference Module
============================
Provides standalone prediction capability. Loads trained model and class index maps,
preprocesses target images, runs predictions, and enforces confidence thresholds.
"""

import os
import sys
import json
import logging
from pathlib import Path
from typing import Dict, Any, Union

import numpy as np
import tensorflow as tf

from config import Config
from preprocessing import load_and_preprocess_image

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("DermaVisionPredict")


class DiseasePredictor:
    """
    Service class to load a trained model and class indices, running inference on demand.
    """
    
    def __init__(self, model_path: Union[str, Path] = None) -> None:
        """
        Initializes the predictor. Loads configuration, class indices, and model weights.
        
        Args:
            model_path (str or Path, optional): Custom path to the model weights.
        """
        self.config = Config()
        
        # 1. Load class indices
        class_indices_path = self.config.models_dir / "class_indices.json"
        if not class_indices_path.exists():
            raise FileNotFoundError(
                f"Class indices map not found at {class_indices_path}. "
                "Ensure the model has been trained or class indices are generated first."
            )
            
        with open(class_indices_path, "r") as f:
            class_to_idx = json.load(f)
            
        # Reverse mapping: index to class name
        self.idx_to_class = {int(idx): name for name, idx in class_to_idx.items()}
        logger.info(f"Loaded class map containing {len(self.idx_to_class)} classes.")
        
        # 2. Select and load the model
        if model_path is None:
            # Check for best model first, fallback to final
            selected_path = self.config.models_dir / "best_model.keras"
            if not selected_path.exists():
                selected_path = self.config.models_dir / "final_model.keras"
        else:
            selected_path = Path(model_path)
            
        if not selected_path.exists():
            raise FileNotFoundError(f"Model file not found at: {selected_path}")
            
        logger.info(f"Loading Keras model from {selected_path}...")
        self.model = tf.keras.models.load_model(str(selected_path))
        logger.info("Model loaded successfully. Ready for inference.")

    def predict(self, image_path: str) -> Dict[str, Any]:
        """
        Predicts the skin disease class and returns the prediction result.
        If confidence is below 60.0%, the disease name is replaced with "Unknown".
        
        Args:
            image_path (str): Path to the image file.
            
        Returns:
            Dict[str, Any]: Dictionary containing "disease" and "confidence".
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Target image path does not exist: {image_path}")
            
        # 1. Preprocess the image
        # Adding a batch dimension (shape [1, 380, 380, 3]) because models expect batches
        img_tensor = load_and_preprocess_image(image_path, img_size=self.config.IMG_SIZE)
        img_batch = tf.expand_dims(img_tensor, axis=0)
        
        # 2. Perform inference
        # verbose=0 suppresses Keras prediction progress bar stdout
        predictions = self.model.predict(img_batch, verbose=0)[0]
        
        # 3. Retrieve argmax index and maximum probability
        predicted_idx = int(np.argmax(predictions))
        confidence_prob = float(predictions[predicted_idx])
        
        # Map to percentage
        confidence_percent = round(confidence_prob * 100, 2)
        disease_name = self.idx_to_class.get(predicted_idx, "Unknown")
        
        # 4. Enforce confidence threshold requirement
        # "If confidence is below 60%, Return { 'disease': 'Unknown', 'confidence': 54.21 }"
        if confidence_percent < 60.0:
            logger.info(f"Confidence score ({confidence_percent}%) is below 60.0%. Overriding with 'Unknown'.")
            disease_name = "Unknown"
            
        return {
            "disease": disease_name,
            "confidence": confidence_percent
        }


if __name__ == "__main__":
    # Standard CLI invocation handler
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path> [model_path]")
        sys.exit(1)
        
    img_file = sys.argv[1]
    custom_model = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        predictor = DiseasePredictor(model_path=custom_model)
        result = predictor.predict(img_file)
        print(json.dumps(result, indent=2))
    except Exception as err:
        print(json.dumps({"error": str(err)}), file=sys.stderr)
        sys.exit(1)
