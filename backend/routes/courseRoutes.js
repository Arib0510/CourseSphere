// =============================================
// Course Routes
// =============================================

const express = require("express");
const { body } = require("express-validator");
const { validate } = require("../middleware/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const multer = require("multer");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCoursePDF,
} = require("../controllers/courseController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed."));
  },
});

const router = express.Router();

// ----- Validation Rules -----

const courseValidation = [
  body("course_no")
    .trim()
    .notEmpty()
    .withMessage("Course number is required.")
    .isLength({ max: 20 })
    .withMessage("Course number must not exceed 20 characters."),
  body("course_title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required.")
    .isLength({ max: 200 })
    .withMessage("Course title must not exceed 200 characters."),
  body("credits")
    .isFloat({ min: 0.25, max: 6 })
    .withMessage("Credits must be between 0.25 and 6."),
  body("credit_hours")
    .isFloat({ min: 0.5, max: 10 })
    .withMessage("Credit hours must be between 0.5 and 10."),
  body("academic_year")
    .optional()
    .trim(),
  body("semester")
    .optional()
    .trim(),
  body("category")
    .optional()
    .trim(),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer."),
];

const courseUpdateValidation = [
  body("course_no")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Course number must not exceed 20 characters."),
  body("course_title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Course title must not exceed 200 characters."),
  body("credits")
    .optional()
    .isFloat({ min: 0.25, max: 6 })
    .withMessage("Credits must be between 0.25 and 6."),
  body("credit_hours")
    .optional()
    .isFloat({ min: 0.5, max: 10 })
    .withMessage("Credit hours must be between 0.5 and 10."),
  body("academic_year")
    .optional()
    .trim(),
  body("semester")
    .optional()
    .trim(),
  body("category")
    .optional()
    .trim(),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer."),
];

// ----- Routes -----

// Public routes — browse & search courses
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Admin-only routes — CRUD operations
router.post("/upload-pdf", authMiddleware, adminMiddleware, upload.single("pdf"), uploadCoursePDF);
router.post("/", authMiddleware, adminMiddleware, courseValidation, validate, createCourse);
router.put("/:id", authMiddleware, adminMiddleware, courseUpdateValidation, validate, updateCourse);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourse);

module.exports = router;
