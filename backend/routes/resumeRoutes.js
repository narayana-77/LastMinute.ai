const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const protect = require("../middleware/authMiddleware");
const {
  uploadResume,
  getResumeById,
  getUserResumes,
  deleteResume,
} = require("../controllers/resumeController");

// All routes require authentication
router.use(protect);

// POST /api/resume/upload  — upload & analyze resume
router.post("/upload", upload.single("resume"), uploadResume);

// GET /api/resume/          — get all resumes for user
router.get("/", getUserResumes);

// GET /api/resume/:id       — get specific resume
router.get("/:id", getResumeById);

// DELETE /api/resume/:id    — delete resume
router.delete("/:id", deleteResume);

module.exports = router;
