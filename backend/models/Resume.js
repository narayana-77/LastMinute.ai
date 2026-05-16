const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx"],
      required: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    parsedData: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      skills: [{ type: String }],
      experience: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          institution: String,
          degree: String,
          year: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          techStack: [String],
        },
      ],
      suggestedRoles: [{ type: String }],
      strengthAreas: [{ type: String }],
      weakAreas: [{ type: String }],
      interviewReadiness: { type: Number, default: 0 }, // 0-100
      summary: { type: String, default: "" },
    },
    targetRole: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
