// =============================================
// Registration Routes
// =============================================

const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getMyRegistrations,
  registerCourse,
  dropCourse,
} = require("../controllers/registrationController");

const router = express.Router();

// ----- Validation Rules -----

const registerValidation = [
  body("course_id")
    .isInt({ min: 1 })
    .withMessage("A valid course ID is required."),
];

// ----- Routes (all require authentication) -----

// Get the student's own registrations
router.get("/", authMiddleware, getMyRegistrations);

// Register for a course
router.post("/", authMiddleware, registerValidation, validate, registerCourse);

// Drop a course registration
router.delete("/:id", authMiddleware, dropCourse);

module.exports = router;
