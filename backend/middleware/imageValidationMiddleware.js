const { validateImage } = require('../services/imageValidationService');

/**
 * Image Validation Middleware
 *
 * Runs after uploadMiddleware (file is already on disk via Multer).
 * Calls imageValidationService to perform all quality checks.
 * Attaches the result to req.imageValidation and calls next().
 *
 * On hard failure: responds immediately with 400 and descriptive message.
 * On soft warnings: attaches warnings to req.imageValidation and continues.
 *
 * Usage in routes:
 *   router.post('/scan/predict', protect, uploadMiddleware, imageValidationMiddleware, predictScan);
 */
const imageValidationMiddleware = async (req, res, next) => {
  try {
    const validationResult = await validateImage(req.file);

    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.error
      });
    }

    // Attach the full validation result for the controller to use
    req.imageValidation = validationResult;

    next();
  } catch (error) {
    console.error('Image validation middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during image validation.'
    });
  }
};

module.exports = imageValidationMiddleware;
