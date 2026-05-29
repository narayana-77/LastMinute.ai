const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const Resume = require("../models/Resume");

// AI SERVICES
const extractResumeData = require("../services/ai/extractResumeData");

const analyzeATS = require("../services/ai/analyzeATS");

const calculateATSScore = require("../services/ai/calculateATSScore");

const generateImprovements = require("../services/ai/generateImprovements");

const matchJobDescription = require("../services/ai/matchJobDescription");

/**

* Extract raw text from uploaded file
  */
  const extractTextFromFile = async (
  filePath,
  mimetype
  ) => {

// PDF
if (mimetype === "application/pdf") {


const dataBuffer =
  fs.readFileSync(filePath);

const data =
  await pdfParse(dataBuffer);

return data.text;


}

// DOCX
if (
mimetype ===
"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
) {


const result =
  await mammoth.extractRawText({
    path: filePath,
  });

return result.value;


}

throw new Error("Unsupported file type");
};

/**

* POST /api/resume/upload
  */
  const uploadResume = async (req, res) => {

const filePath = req.file?.path;

try {


// CHECK FILE
if (!req.file) {
  return res.status(400).json({
    message: "No file uploaded",
  });
}

const {
  targetRole,
  jobDescription,
} = req.body;

const userId = req.user.id;

// FILE TYPE
const fileExt = path
  .extname(req.file.originalname)
  .toLowerCase();

const fileType =
  fileExt === ".pdf"
    ? "pdf"
    : "docx";

// STEP 1 → EXTRACT TEXT
const rawText =
  await extractTextFromFile(
    req.file.path,
    req.file.mimetype
  );

// VALIDATE TEXT
if (
  !rawText ||
  rawText.trim().length < 50
) {
  return res.status(400).json({
    message:
      "Could not extract enough text from the file.",
  });
}

// STEP 2 → CREATE DB ENTRY
const resume =
  await Resume.create({
    userId,

    fileName:
      req.file.originalname,

    fileType,

    rawText,

    targetRole:
      targetRole || "",

    status: "processing",
  });

// STEP 3 → EXTRACT DATA
const extractedData =
  await extractResumeData(
    rawText
  );

// STEP 4 → ATS ANALYSIS
const atsResults =
  await analyzeATS(
    extractedData,
    targetRole
  );

// STEP 5 → IMPROVEMENTS
const improvements =
  await generateImprovements(
    extractedData,
    targetRole
  );

// STEP 6 → JOB MATCHING
let jobMatch = {};

if (
  jobDescription &&
  jobDescription.trim().length > 20
) {

  jobMatch =
    await matchJobDescription(
      extractedData,
      jobDescription
    );
}

// STEP 7 → FINAL ATS SCORE
const overallScore =
  calculateATSScore(
    atsResults.atsAnalysis
  );

// STEP 8 → FINAL STRUCTURED DATA
const parsedData = {

  ...extractedData,

  improvements,

  jobMatch,

  atsAnalysis: {
    ...atsResults.atsAnalysis,

    overallScore,
  },

  strengthAreas:
    atsResults.strengthAreas || [],

  weakAreas:
    atsResults.weakAreas || [],

  suggestedRoles:
    atsResults.suggestedRoles || [],

  recruiterInsights:
    atsResults.recruiterInsights || {},

  interviewReadiness:
    overallScore,
};

// STEP 9 → SAVE
resume.parsedData =
  parsedData;

resume.status =
  "completed";

await resume.save();

// DELETE TEMP FILE
if (
  fs.existsSync(req.file.path)
) {
  fs.unlinkSync(req.file.path);
}

// SUCCESS
return res.status(200).json({
  message:
    "Resume uploaded and analyzed successfully",

  resume: {
    id: resume._id,

    fileName:
      resume.fileName,

    targetRole:
      resume.targetRole,

    parsedData:
      resume.parsedData,

    status:
      resume.status,

    createdAt:
      resume.createdAt,
  },
});


} catch (error) {


console.error(
  "Resume upload error:",
  error
);

// CLEAN FILE
if (
  filePath &&
  fs.existsSync(filePath)
) {
  fs.unlinkSync(filePath);
}

return res.status(500).json({
  message:
    "Failed to process resume",

  error:
    error.message,
});


}
};

/**

* GET /api/resume/:id
  */
  const getResumeById = async (
  req,
  res
  ) => {

try {


const resume =
  await Resume.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

if (!resume) {
  return res.status(404).json({
    message:
      "Resume not found",
  });
}

return res.status(200).json({
  resume,
});


} catch (error) {


console.error(
  "Get resume error:",
  error
);

return res.status(500).json({
  message:
    "Server error",

  error:
    error.message,
});


}
};

/**

* GET /api/resume
  */
  const getUserResumes = async (
  req,
  res
  ) => {

try {


const resumes =
  await Resume.find({
    userId: req.user.id,
  })
    .sort({
      createdAt: -1,
    })
    .select("-rawText");

return res.status(200).json({
  resumes,
});


} catch (error) {


console.error(
  "Get resumes error:",
  error
);

return res.status(500).json({
  message:
    "Server error",

  error:
    error.message,
});


}
};

/**

* DELETE /api/resume/:id
  */
  const deleteResume = async (
  req,
  res
  ) => {

try {


const resume =
  await Resume.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

if (!resume) {
  return res.status(404).json({
    message:
      "Resume not found",
  });
}

return res.status(200).json({
  message:
    "Resume deleted successfully",
});


} catch (error) {


console.error(
  "Delete resume error:",
  error
);

return res.status(500).json({
  message:
    "Server error",

  error:
    error.message,
});


}
};

module.exports = {
uploadResume,
getResumeById,
getUserResumes,
deleteResume,
};
