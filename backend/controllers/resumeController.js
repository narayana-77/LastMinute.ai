const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");
const { parseResumeWithAI } = require("../config/aiService");

/**
 * Extract raw text from uploaded file (PDF or DOCX)
 */
const extractTextFromFile = async (filePath, mimetype) => {
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("Unsupported file type");
};

/**
 * POST /api/resume/upload
 * Uploads resume, extracts text, parses with AI, saves to DB
 */
const uploadResume = async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { targetRole } = req.body;
    const userId = req.user.id; // from JWT middleware

    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const fileType = fileExt === ".pdf" ? "pdf" : "docx";

    // 1. Extract raw text
    const rawText = await extractTextFromFile(req.file.path, req.file.mimetype);

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({
        message:
          "Could not extract enough text from the file. Make sure it's not scanned/image-based.",
      });
    }

    // 2. Create resume document with 'processing' status
    const resume = await Resume.create({
      userId,
      fileName: req.file.originalname,
      fileType,
      rawText,
      targetRole: targetRole || "",
      status: "processing",
    });

    // 3. Parse with Claude AI
    const parsedData = await parseResumeWithAI(rawText, targetRole);

    // 4. Update resume with parsed data
    resume.parsedData = parsedData;
    resume.status = "completed";
    await resume.save();

    // 5. Clean up uploaded file from disk
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "Resume uploaded and analyzed successfully",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        targetRole: resume.targetRole,
        parsedData: resume.parsedData,
        status: resume.status,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // If resume was created, mark it failed
    if (error.resumeId) {
      await Resume.findByIdAndUpdate(error.resumeId, { status: "failed" });
    }

    return res.status(500).json({
      message: "Failed to process resume",
      error: error.message,
    });
  }
};

/**
 * GET /api/resume/:id
 * Fetch a specific resume by ID
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    console.error("Get resume error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/resume/
 * Get all resumes for the logged-in user
 */
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-rawText"); // Don't send raw text in list view

    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("Get resumes error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE /api/resume/:id
 * Delete a resume
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadResume, getResumeById, getUserResumes, deleteResume };
