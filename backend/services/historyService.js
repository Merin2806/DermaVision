const mongoose = require('mongoose');
const PredictionHistory = require('../models/PredictionHistory');

/**
 * Save a new prediction to the database.
 *
 * @param {Object} data
 * @param {string} data.userId        – ObjectId of the logged-in user
 * @param {string} data.condition     – Predicted skin condition
 * @param {number} data.confidence    – Confidence score (0–100)
 * @param {string} data.severity      – Mild | Moderate | Severe
 * @param {string} [data.imagePath]   – Uploaded image path (optional)
 * @param {string} [data.pdfPath]     – Generated PDF path (optional)
 * @param {string[]} [data.warnings]  – Image quality warnings (optional)
 * @returns {Promise<Object>} The saved document
 */
const savePrediction = async ({
  userId,
  condition,
  confidence,
  severity,
  imagePath = null,
  pdfPath = null,
  warnings = []
}) => {
  const record = new PredictionHistory({
    user: userId,
    condition,
    confidence,
    severity,
    imagePath,
    pdfPath,
    warnings
  });

  return await record.save();
};

/**
 * Get all predictions for a specific user, newest first.
 *
 * @param {string} userId – ObjectId of the logged-in user
 * @returns {Promise<Array>} Array of prediction history records
 */
const getPredictionHistory = async (userId) => {
  return await PredictionHistory
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .select('-user -__v')   // exclude internal fields from response
    .lean();
};

/**
 * Delete a single prediction record — only if it belongs to the user.
 *
 * @param {string} predictionId – MongoDB _id of the prediction
 * @param {string} userId       – ObjectId of the logged-in user
 * @returns {Promise<Object|null>} The deleted document, or null if not found
 */
const deletePrediction = async (predictionId, userId) => {
  // Validate that predictionId is a well-formed ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(predictionId)) {
    return null;
  }

  return await PredictionHistory.findOneAndDelete({
    _id: predictionId,
    user: userId
  });
};

module.exports = {
  savePrediction,
  getPredictionHistory,
  deletePrediction
};
