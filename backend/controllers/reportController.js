const { generateReport } = require('../services/pdfService');

/**
 * @desc    Generate a PDF screening report from prediction + recommendation data.
 * @route   POST /api/report/generate
 * @access  Private (JWT protected)
 */
const generatePdfReport = async (req, res, next) => {
  try {
    const { prediction, recommendation } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!prediction || !prediction.condition || prediction.confidence === undefined || !prediction.severity) {
      return res.status(400).json({
        success: false,
        message: 'Missing or incomplete prediction data. Required fields: condition, confidence, severity.'
      });
    }

    if (!recommendation || !recommendation.description) {
      return res.status(400).json({
        success: false,
        message: 'Missing or incomplete recommendation data. Required field: description.'
      });
    }

    // ── Delegate to PDF Service ───────────────────────────────────────────────
    const { filename, downloadUrl } = await generateReport({
      prediction,
      recommendation,
      options: {
        // Future fields (imagePath, gradCamPath, logoPath, etc.) can be passed here
        // without modifying this controller.
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Report generated successfully.',
      filename,
      downloadUrl
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePdfReport };
