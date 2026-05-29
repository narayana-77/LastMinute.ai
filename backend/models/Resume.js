const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    // USER INFO
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // FILE INFO
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

    // AI PARSED DATA
    parsedData: {
      // BASIC INFO
      name: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      github: {
        type: String,
        default: "",
      },

      portfolio: {
        type: String,
        default: "",
      },

      location: {
        type: String,
        default: "",
      },

      summary: {
        type: String,
        default: "",
      },

      // SKILLS
      skills: [String],

      softSkills: [String],

      tools: [String],

      certifications: [String],

      achievements: [String],

      languages: [String],

      // EXPERIENCE
      experience: [
        {
          company: String,
          role: String,
          duration: String,
          description: String,
          impactScore: {
            type: Number,
            default: 0,
          },
        },
      ],

      // EDUCATION
      education: [
        {
          institution: String,
          degree: String,
          year: String,
        },
      ],

      // PROJECTS
      projects: [
        {
          name: String,
          description: String,
          techStack: [String],

          strengthScore: {
            type: Number,
            default: 0,
          },
        },
      ],

      // ROLE ANALYSIS
      suggestedRoles: [String],

      strengthAreas: [String],

      weakAreas: [String],

      // ATS ANALYSIS
      atsAnalysis: {
        overallScore: {
          type: Number,
          default: 0,
        },

        keywordScore: {
          type: Number,
          default: 0,
        },

        skillsScore: {
          type: Number,
          default: 0,
        },

        formattingScore: {
          type: Number,
          default: 0,
        },

        readabilityScore: {
          type: Number,
          default: 0,
        },

        projectsScore: {
          type: Number,
          default: 0,
        },

        experienceScore: {
          type: Number,
          default: 0,
        },
      },

      // JOB MATCHING
      jobMatch: {
        matchPercentage: {
          type: Number,
          default: 0,
        },

        matchedKeywords: [String],

        missingKeywords: [String],

        missingSkills: [String],
      },

      // RECRUITER INSIGHTS
      recruiterInsights: {
        strengths: [String],

        weaknesses: [String],

        rejectionRisks: [String],

        shortlistProbability: {
          type: Number,
          default: 0,
        },
      },

      // IMPROVEMENTS
      improvements: {
        betterSummary: {
          type: String,
          default: "",
        },

        betterBulletPoints: [String],

        quantifiedSuggestions: [String],

        formattingFixes: [String],
      },

      // FINAL SCORE
      interviewReadiness: {
        type: Number,
        default: 0,
      },
    },

    // TARGET ROLE
    targetRole: {
      type: String,
      default: "",
    },

    // STATUS
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);