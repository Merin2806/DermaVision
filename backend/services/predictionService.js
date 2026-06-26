/**
 * Prediction Service — Mock Implementation
 *
 * This service simulates an AI model prediction by randomly selecting
 * a skin condition, confidence score, and severity level.
 *
 * FUTURE COMPATIBILITY:
 * When integrating a real AI model, replace only the logic inside
 * `getPrediction`. The controller and routes do not need to change.
 *
 * @param {Object} input
 * @param {Object} input.file - The uploaded image file object from Multer.
 * @returns {Promise<Object>} Prediction result with condition, confidence, and severity.
 */

const SUPPORTED_CONDITIONS = ['Acne', 'Eczema', 'Psoriasis', 'Fungal Infection'];
const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe'];

const getPrediction = async ({ file }) => {
  // Randomly select a condition from the supported list
  const conditionIndex = Math.floor(Math.random() * SUPPORTED_CONDITIONS.length);
  const condition = SUPPORTED_CONDITIONS[conditionIndex];

  // Generate a random confidence score between 70 and 99 (inclusive)
  const confidence = Math.floor(Math.random() * (99 - 70 + 1)) + 70;

  // Randomly select a severity level
  const severityIndex = Math.floor(Math.random() * SEVERITY_LEVELS.length);
  const severity = SEVERITY_LEVELS[severityIndex];

  return {
    condition,
    confidence,
    severity
  };
};

module.exports = {
  getPrediction
};
