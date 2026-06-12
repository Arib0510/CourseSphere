// =============================================
// Express Server — Entry Point
// =============================================

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import error handler
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// =============================================
// Middleware
// =============================================

// CORS — allow all origins in development
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// HTTP request logging
app.use(morgan("dev"));

// =============================================
// Routes
// =============================================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CourseSphere API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "CourseSphere API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

// =============================================
// Error Handling
// =============================================

// 404 handler — must come after all route definitions
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// =============================================
// Start Server
// =============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 CourseSphere API Server`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health\n`);
});
