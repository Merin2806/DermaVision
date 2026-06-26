const { getRecommendation } = require('../services/recommendationService');
const apiResponse = require('../utils/apiResponse');

/**
 * Handle GET /api/recommendation/:condition requests.
 */
const getRecommendationByCondition = async (req, res, next) => {
  try {
    const { condition } = req.params;

    if (!condition) {
      return apiResponse.badRequest(res, 'Condition parameter is required.');
    }

    // Fetch recommendation from service
    const recommendation = await getRecommendation({ condition });

    if (!recommendation) {
      return apiResponse.notFound(res, 'Disease information not found.');
    }

    // Normalize severity input (e.g., 'mild' -> 'Mild')
    let severity = 'Moderate';
    if (req.query.severity) {
      severity = req.query.severity.charAt(0).toUpperCase() + req.query.severity.slice(1).toLowerCase();
    }

    // Return the response according to requirements
    return apiResponse.success(res, 'Recommendation retrieved successfully.', {
      condition: recommendation.name,
      recommendation: {
        description: recommendation.description,
        symptoms: recommendation.symptoms,
        causes: recommendation.causes,
        precautions: recommendation.precautions,
        homeCare: recommendation.homeCare,
        imageTips: recommendation.imageTips || [],
        severityAdvice: recommendation.severityAdvice?.[severity] || recommendation.severityAdvice?.Moderate || '',
        consultDermatologist: recommendation.consultDermatologist,
        disclaimer: recommendation.disclaimer
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendationByCondition
};
