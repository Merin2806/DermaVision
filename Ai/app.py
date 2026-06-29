"""
DermaVision FastAPI AI Service
==============================
Serves skin disease predictions via a REST API endpoint.
Exposes a single POST /predict endpoint, loading the model state once at startup.
"""

import os
import uuid
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Dict, Any

import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from config import Config
from predict import DiseasePredictor

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("DermaVisionAPI")

# Global predictor instance
predictor = None
temp_dir = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown lifespan events.
    Loads the trained model once to optimize inference latencies.
    """
    global predictor, temp_dir
    logger.info("Initializing DermaVision AI Service...")
    
    # Resolve sandboxed temporary directory within the workspace
    config = Config()
    temp_dir = config.outputs_dir / "temp"
    temp_dir.mkdir(parents=True, exist_ok=True)
    logger.info(f"Temporary file workspace configured at: {temp_dir}")
    
    try:
        # Load prediction model
        predictor = DiseasePredictor()
        logger.info("Model loaded successfully. Service ready for incoming scans.")
    except Exception as e:
        logger.critical(f"Failed to load model on startup: {e}")
        # We do not crash the app, but log it so developers can troubleshoot
        
    yield
    
    # Cleanup operations during shutdown
    logger.info("Shutting down DermaVision AI Service...")


# Initialize FastAPI with Lifespan
app = FastAPI(
    title="DermaVision AI Prediction API",
    description="Microservice providing TensorFlow EfficientNet-B4 skin disease predictions",
    version="1.0.0",
    lifespan=lifespan
)


@app.post("/predict", response_model=Dict[str, Any])
async def predict_skin_disease(image: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Receives an uploaded skin lesion image and returns the predicted disease class
    and confidence score.
    
    Args:
        image (UploadFile): The uploaded image file.
        
    Returns:
        JSONResponse: {"disease": "Psoriasis", "confidence": 98.62} or a standard error.
    """
    global predictor, temp_dir
    
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="Prediction model is not initialized. Check server startup logs."
        )
        
    # Validate file type using extensions
    suffix = Path(image.filename).suffix.lower()
    if suffix not in [".jpg", ".jpeg", ".png", ".bmp", ".webp"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{suffix}'. Supported: JPG, JPEG, PNG, BMP, WEBP."
        )
        
    # Create unique name to prevent collisions during concurrent runs
    unique_filename = f"{uuid.uuid4()}{suffix}"
    temp_file_path = temp_dir / unique_filename
    
    try:
        # Save uploaded bytes to local sandboxed path
        with open(temp_file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
            
        logger.info(f"Received scan '{image.filename}' saved as '{unique_filename}'")
        
        # Run classification
        prediction = predictor.predict(str(temp_file_path))
        logger.info(f"Prediction success for '{unique_filename}': {prediction}")
        return prediction
        
    except Exception as err:
        logger.error(f"Inference error processing '{image.filename}': {err}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal inference failure: {str(err)}"
        )
        
    finally:
        # Guarantee cleanup of temporary uploaded files
        if temp_file_path.exists():
            try:
                os.remove(temp_file_path)
                logger.info(f"Cleaned up local file '{unique_filename}'")
            except Exception as cleanup_err:
                logger.error(f"Failed to delete '{unique_filename}': {cleanup_err}")


@app.get("/health")
def health_check() -> Dict[str, str]:
    """
    Simple health verification check.
    """
    return {
        "status": "healthy",
        "model_loaded": str(predictor is not None)
    }


if __name__ == "__main__":
    # Start service on standard port
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=False)
