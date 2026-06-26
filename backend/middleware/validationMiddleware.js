const { validationResult, body, param } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

/**
 * Middleware to check validation results.
 * Extracts the first validation error and returns a 400 Bad Request error.
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return apiResponse.badRequest(res, `Validation failed: ${firstError}`);
  }
  next();
};

/**
 * Validation rules for user registration.
 */
const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  validateResults
];

/**
 * Validation rules for user login.
 */
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
  validateResults
];

/**
 * Validation rules for scan prediction.
 * Ensures that an image file was uploaded by the multer middleware.
 */
const validatePrediction = [
  (req, res, next) => {
    if (!req.file) {
      return apiResponse.badRequest(res, 'No image file provided. Please upload a valid image.');
    }
    next();
  }
];

/**
 * Validation rules for generating PDF reports.
 */
const validateReport = [
  body('prediction')
    .notEmpty()
    .withMessage('Prediction data is required.'),
  body('prediction.condition')
    .notEmpty()
    .withMessage('Prediction condition is required.'),
  body('prediction.confidence')
    .isNumeric()
    .withMessage('Prediction confidence must be a number.'),
  body('prediction.severity')
    .notEmpty()
    .withMessage('Prediction severity is required.'),
  body('recommendation')
    .notEmpty()
    .withMessage('Recommendation data is required.'),
  body('recommendation.description')
    .notEmpty()
    .withMessage('Recommendation description is required.'),
  validateResults
];

/**
 * Validation rules for deleting prediction history.
 * Enforces a valid MongoDB ObjectId.
 */
const validateDeleteHistory = [
  param('id')
    .isMongoId()
    .withMessage('Invalid prediction record ID format.'),
  validateResults
];

module.exports = {
  validateSignup,
  validateLogin,
  validatePrediction,
  validateReport,
  validateDeleteHistory
};
