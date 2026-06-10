// =============================================
// Validation Middleware
// =============================================
// Uses express-validator to validate request data.
// Returns 400 with detailed error messages on failure.
// =============================================

const { validationResult } = require("express-validator");
const { error } = require("../utils/apiResponse");

/**
 * Middleware that checks for validation errors from
 * express-validator chains and returns 400 if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return error(res, "Validation failed", 400, extractedErrors);
  }

  next();
};

module.exports = { validate };
