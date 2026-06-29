# DermaVision AI Module

Production-grade skin disease detection classifier using TensorFlow 2.15.1 and EfficientNet-B4, served via a FastAPI microservice.

## Directory Structure

```text
Summer Project/
│
├── DermaVision-models/  # Saved models, config, and class mappings (outside DermaVision/)
│   ├── best_model.keras
│   ├── final_model.keras
│   ├── class_indices.json
│   └── config.yaml
│
└── DermaVision/
    └── Ai/
├── outputs/             # Evaluation plots and report files
│   ├── training_history.png
│   ├── training_history.json
│   ├── confusion_matrix.png
│   ├── classification_report.txt
│   └── model_summary.txt
├── logs/                # TensorBoard logs (Stage 1 & Stage 2)
│   ├── stage1/
│   └── stage2/
│
├── config.py            # Random seeds, hardware, and directory setups
├── dataloader.py        # Dataset pipelining, class weight adjustments
├── augmentations.py     # Training-only Keras augmentation pipeline
├── preprocessing.py     # RGB decoding, resizing (380x380), normalization
├── model.py             # EfficientNet-B4 architecture & future-ready stubs
├── train.py             # Two-stage model training orchestration
├── evaluate.py          # Model testing metrics, reports, and CM plotting
├── predict.py           # CLI prediction and confidence thresholds
├── app.py               # FastAPI server exposing POST /predict
└── requirements.txt     # Locked project dependencies
```

---

## Setup Instructions

### 1. Recreate and Activate Virtual Environment
Ensure you have Python 3.11.x installed:
```bash
# In the DermaVision/Ai directory
rm -rf venv
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## AI Workflows

### 1. Training the Model
To start the two-stage training (Stage 1: frozen backbone head tuning; Stage 2: backbone fine-tuning):
```bash
python train.py
```
This will automatically:
- Load config and enforce reproducible random seeds.
- Compute balanced class weights to address training set imbalance.
- Run training with checkpoints, early stopping, and tensorboard logging.
- Save `best_model.keras`, `final_model.keras`, `class_indices.json`, and `config.yaml` to `DermaVision-models/` (at the project root).
- Save `training_history.png`, `training_history.json`, and `model_summary.txt` to `outputs/`.

### 2. Running Evaluation
To evaluate the best trained checkpoint on the test set:
```bash
python evaluate.py
```
This generates and saves to `outputs/`:
- Overall Accuracy, Precision, Recall, F1-Score, and Multi-class ROC-AUC (OVR).
- Per-class accuracy breakups.
- `confusion_matrix.png` normalized heatmap chart.
- `classification_report.txt` and `metrics_summary.json`.

### 3. Standalone Inference CLI
To run quick command-line predictions on local images:
```bash
python predict.py <path_to_image>
```
Output format:
```json
{
  "disease": "Psoriasis",
  "confidence": 98.62
}
```
*Note: If prediction confidence falls below 60.0%, the disease field is automatically overridden to `"Unknown"`.*

---

## FastAPI Microservice

To run the REST API service (binds to port `8000` by default):
```bash
python app.py
```

### POST `/predict`
- **Request Format**: `multipart/form-data`
- **Field Name**: `image` (binary file)
- **Response Format**: `application/json`
- **Sample Success Response**:
  ```json
  {
    "disease": "Eczema",
    "confidence": 88.54
  }
  ```

---

## Future Integration Architectures
The codebase is structured to support future multi-task scaling. Inside `model.py`, structural placeholder stubs and class interfaces are registered for:
1. **Severity Prediction**: Multi-task classification head outputting Severity level (`Mild`, `Moderate`, `Severe`).
2. **U-Net Segmentation**: Encoder-Decoder network leveraging EfficientNet backbone features to generate lesion boundary masks.
3. **Vision-Language Model (VLM)**: Projection layer aligning backbone embeddings with text model token spaces.
