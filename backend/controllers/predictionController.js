const { performance } = require('perf_hooks');
const { getPrediction } = require('../services/predictionService');
const { getRecommendation } = require('../services/recommendationService');
const { savePrediction } = require('../services/historyService');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Predict skin condition from uploaded image and return recommendation.
 * @route   POST /api/scan/predict
 * @access  Private (JWT protected)
 */
const predictScan = async (req, res, next) => {
  const startTime = performance.now();
  try {
    // 1. Validate that an image was uploaded
    if (!req.file) {
      return apiResponse.badRequest(res, 'No image file provided. Please upload a valid image.');
    }

    // 2. Call Prediction Service to simulate AI model output
    const prediction = await getPrediction({ file: req.file });

    // 3. Fetch corresponding recommendation from Recommendation Service
    const diseaseInfo = await getRecommendation({ condition: prediction.condition });

    if (!diseaseInfo) {
      return apiResponse.notFound(res, `Recommendation data not found for condition: ${prediction.condition}`);
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

    // Calculate processing time
    const duration = Math.round(performance.now() - startTime);

    // 6. Return one combined response
    return apiResponse.success(res, 'Prediction completed successfully.', {
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
        imageTips: diseaseInfo.imageTips || [],
        severityAdvice: diseaseInfo.severityAdvice?.[prediction.severity] || diseaseInfo.severityAdvice?.Moderate || '',
        consultDermatologist: diseaseInfo.consultDermatologist,
        disclaimer: diseaseInfo.disclaimer
      },
      metadata: {
        model: "Mock Prediction Engine",
        version: "1.0.0",
        processingTime: `${duration} ms`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predictScan
};
