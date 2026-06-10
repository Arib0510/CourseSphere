// =============================================
// Authentication Routes
// =============================================

const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const router = express.Router();

// ----- Validation Rules -----

const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("full_name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters."),
  body("student_id")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Student ID cannot be empty."),
  body("department")
    .optional()
    .trim(),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

const updateProfileValidation = [
  body("full_name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters."),
  body("student_id")
    .optional()
    .trim(),
  body("department")
    .optional()
    .trim(),
];

// ----- Routes -----

// Public routes
router.post("/signup", signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);

// Protected routes (require authentication)
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfileValidation, validate, updateProfile);

module.exports = router;
