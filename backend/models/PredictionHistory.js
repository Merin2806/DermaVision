const mongoose = require('mongoose');

/**
 * PredictionHistory Model
 *
 * Stores each individual prediction result linked to a user.
 *
 * FUTURE COMPATIBILITY — the schema is intentionally extended with
 * optional fields for later use without breaking existing APIs:
 *   - modelVersion   : AI model version used for prediction
 *   - gradCamPath    : path to the Grad-CAM saliency map image
 *   - bodyPart       : detected/labelled body part
 *   - segMaskPath    : path to segmentation mask image
 *   - processingTime : inference duration in milliseconds
 */
const predictionHistorySchema = new mongoose.Schema(
  {
    // ── Core fields ───────────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    condition: {
      type: String,
      required: true,
      trim: true
    },
    confidence: {
      type: Number,
      required: true
    },
    severity: {
      type: String,
      required: true,
      trim: true
    },
    imagePath: {
      type: String,
      default: null
    },
    pdfPath: {
      type: String,
      default: null
    },
    warnings: {
      type: [String],
      default: []
    },

    // ── Future-compatibility fields (all optional) ────────────────────────────
    modelVersion: {
      type: String,
      default: null
    },
    gradCamPath: {
      type: String,
      default: null
    },
    bodyPart: {
      type: String,
      default: null
    },
    segMaskPath: {
      type: String,
      default: null
    },
    processingTime: {
      type: Number,     // milliseconds
      default: null
    }
  },
  {
    timestamps: true   // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);
