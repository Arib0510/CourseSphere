// =============================================
// API Response Helpers
// =============================================
// Consistent response format across all endpoints:
// { success: boolean, message: string, data?: any }
// =============================================

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response payload
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, message, data = null, statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Additional error details
 */
const error = (res, message, statusCode = 500, errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Send a paginated success response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Response payload
 * @param {object} pagination - { page, limit, total }
 */
const paginated = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

module.exports = { success, error, paginated };
