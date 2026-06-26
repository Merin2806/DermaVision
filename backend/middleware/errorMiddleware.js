/**
 * Global Error Handling Middleware
 *
 * Must be registered as the LAST middleware in server.js:
 *   app.use(errorHandler);
 *
 * Catches any error passed via next(error) from a route or controller.
 * - Logs the error with console.error()
 * - Returns a consistent JSON response shape
 * - Exposes the stack trace only in development mode
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Log the full error unconditionally for server-side visibility
  console.error(`[${new Date().toISOString()}] ERROR — ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Use the status code already set on the error object, or fall back to 500
  const statusCode = err.statusCode || err.status || 500;

  const response = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  // Expose the stack trace only in development
  if (process.env.NODE_ENV !== 'production') {
    response.error = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
