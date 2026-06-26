const { getPredictionHistory, deletePrediction } = require('../services/historyService');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Get all prediction history for the logged-in user.
 * @route   GET /api/history
 * @access  Private (JWT protected)
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await getPredictionHistory(req.user._id);

    return apiResponse.success(res, 'Prediction history retrieved successfully.', {
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a prediction record (only if it belongs to the logged-in user).
 * @route   DELETE /api/history/:id
 * @access  Private (JWT protected)
 */
const deleteHistory = async (req, res, next) => {
  try {
    const deleted = await deletePrediction(req.params.id, req.user._id);

    if (!deleted) {
      return apiResponse.notFound(res, 'Prediction record not found or you are not authorized to delete it.');
    }

    return apiResponse.success(res, 'Prediction deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  deleteHistory
};
