const { getPredictionHistory, deletePrediction } = require('../services/historyService');

/**
 * @desc    Get all prediction history for the logged-in user.
 * @route   GET /api/history
 * @access  Private (JWT protected)
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await getPredictionHistory(req.user._id);

    return res.status(200).json({
      success: true,
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
      return res.status(404).json({
        success: false,
        message: 'Prediction record not found or you are not authorized to delete it.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prediction deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  deleteHistory
};
