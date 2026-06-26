const { getRecommendation } = require('../services/recommendationService');

/**
 * Handle GET /api/recommendation/:condition requests.
 */
const getRecommendationByCondition = async (req, res, next) => {
  try {
    const { condition } = req.params;

    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'Condition parameter is required.'
      });
    }

    // Fetch recommendation from service
    const recommendation = await getRecommendation({ condition });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Disease information not found.'
      });
    }

    // Return the response according to requirements
    return res.status(200).json({
      success: true,
      condition: recommendation.name,
      recommendation: {
        description: recommendation.description,
        symptoms: recommendation.symptoms,
        causes: recommendation.causes,
        precautions: recommendation.precautions,
        homeCare: recommendation.homeCare,
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
