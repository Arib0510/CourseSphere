// =============================================
// Global Error Handler Middleware
// =============================================
// Catches unhandled errors and sends structured
// JSON error responses.
// =============================================

const errorHandler = (err, req, res, _next) => {
  console.error("❌ Unhandled Error:", err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
