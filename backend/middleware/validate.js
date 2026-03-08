const { body, validationResult } = require("express-validator");

// ── Validation rules ─────────────────────────────────────────────────────────
const reportRules = [
  body("title").notEmpty().trim().withMessage("Project title is required"),
  body("subject").notEmpty().trim().withMessage("Subject name is required"),
  body("subjectCode").notEmpty().trim().withMessage("Subject code is required"),
  body("year")
    .notEmpty()
    .matches(/^\d{4}-\d{2,4}$/)
    .withMessage("Year must be in format 2025-26"),
  body("semesterNumber")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),
  body("semesterWord").notEmpty().withMessage("Semester word is required"),
  body("section").notEmpty().trim().withMessage("Section is required"),

  // Authors
  body("authors")
    .isArray({ min: 1, max: 4 })
    .withMessage("Must have 1–4 authors"),
  body("authors.*.name").notEmpty().trim().withMessage("Each author needs a name"),
  body("authors.*.usn").notEmpty().trim().withMessage("Each author needs a USN"),

  // Guide
  body("guide.name").notEmpty().trim().withMessage("Guide name is required"),
  body("guide.departmentAbbr").notEmpty().withMessage("Guide department abbreviation is required"),
  body("guide.departmentFull").notEmpty().withMessage("Guide full department name is required"),

  // Department
  body("departmentName").notEmpty().withMessage("Department name is required"),
  body("departmentAbbr").notEmpty().withMessage("Department abbreviation is required"),
  body("hod").notEmpty().trim().withMessage("HOD name is required"),

  // Content
  body("abstract").notEmpty().withMessage("Abstract is required"),
];

// ── Middleware: check results ─────────────────────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { reportRules, validate };
