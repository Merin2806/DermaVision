/**
 * Centralized API Response Utility
 */

/**
 * Send a 200 OK success response.
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 * @param {Object} [data={}] - Response payload
 */
const success = (res, message, data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

/**
 * Send a 201 Created success response.
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 * @param {Object} [data={}] - Response payload
 */
const created = (res, message, data = {}) => {
  return res.status(201).json({
    success: true,
    message,
    data
  });
};

/**
 * Send a 400 Bad Request error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const badRequest = (res, message) => {
  return res.status(400).json({
    success: false,
    message
  });
};

/**
 * Send a 401 Unauthorized error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const unauthorized = (res, message) => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Send a 404 Not Found error response.
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const notFound = (res, message) => {
  return res.status(404).json({
    success: false,
    message
  });
};

module.exports = {
  success,
  created,
  badRequest,
  unauthorized,
  notFound
};
