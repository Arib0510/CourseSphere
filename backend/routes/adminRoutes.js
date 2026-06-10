// =============================================
// Admin Routes
// =============================================

const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const {
  getDashboardStats,
  getAllStudents,
  getAllRegistrations,
  createStudent,
  updateStudent,
  deleteStudent,
  rejectRegistration,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication + admin authorization
router.use(authMiddleware);
router.use(adminMiddleware);

// ----- Routes -----

// Dashboard analytics
router.get("/stats", getDashboardStats);

// List all students
router.get("/students", getAllStudents);

// List all registrations (with optional ?course_id= and ?semester= filters)
router.get("/registrations", getAllRegistrations);

// Student CRUD
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// Reject (delete) a registration
router.delete("/registrations/:id", rejectRegistration);

module.exports = router;
