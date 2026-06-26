const { getPrediction } = require('../services/predictionService');
const { getRecommendation } = require('../services/recommendationService');
const { savePrediction } = require('../services/historyService');

/**
 * @desc    Predict skin condition from uploaded image and return recommendation.
 * @route   POST /api/scan/predict
 * @access  Private (JWT protected)
 */
const predictScan = async (req, res, next) => {
  try {
    // 1. Validate that an image was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please upload a valid image.'
      });
    }

    // 2. Call Prediction Service to simulate AI model output
    const prediction = await getPrediction({ file: req.file });

    // 3. Fetch corresponding recommendation from Recommendation Service
    const diseaseInfo = await getRecommendation({ condition: prediction.condition });

    if (!diseaseInfo) {
      return res.status(404).json({
        success: false,
        message: `Recommendation data not found for condition: ${prediction.condition}`
      });
    }

    // 4. Collect any quality warnings from image validation middleware
    const warnings = (req.imageValidation && req.imageValidation.warnings.length > 0)
      ? req.imageValidation.warnings
      : undefined;

    // 5. Auto-save prediction to history (non-blocking — never fails the response)
    savePrediction({
      userId:     req.user._id,
      condition:  prediction.condition,
      confidence: prediction.confidence,
      severity:   prediction.severity,
      imagePath:  req.file ? `uploads/${req.file.filename}` : null,
      warnings:   warnings || []
    }).catch((err) => console.error('History auto-save failed (non-critical):', err));

    // 6. Return one combined response
    return res.status(200).json({
      success: true,
      prediction: {
        condition: prediction.condition,
        confidence: prediction.confidence,
        severity: prediction.severity
      },
      ...(warnings && { warnings }),
      recommendation: {
        description: diseaseInfo.description,
        symptoms: diseaseInfo.symptoms,
        causes: diseaseInfo.causes,
        precautions: diseaseInfo.precautions,
        homeCare: diseaseInfo.homeCare,
        consultDermatologist: diseaseInfo.consultDermatologist,
        disclaimer: diseaseInfo.disclaimer
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predictScan
};
