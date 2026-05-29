const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});
const analyzeATS = async (resumeData, targetRole) => {
  try {
    const prompt = `
Analyze this resume like a professional ATS system and recruiter.

Target Role:
${targetRole}

Resume Data:
${JSON.stringify(resumeData)}

Return ONLY valid JSON:

{
  "strengthAreas": [],
  "weakAreas": [],
  "suggestedRoles": [],

  "atsAnalysis": {
    "keywordScore": 0,
    "skillsScore": 0,
    "formattingScore": 0,
    "readabilityScore": 0,
    "projectsScore": 0,
    "experienceScore": 0
  },

  "recruiterInsights": {
    "strengths": [],
    "weaknesses": [],
    "rejectionRisks": [],
    "shortlistProbability": 0
  }
}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are a premium ATS resume analyzer and recruiter.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.3,
    });

const raw =
  response.choices[0].message.content;

const cleaned =
  raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

return JSON.parse(cleaned);
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    throw new Error("Failed ATS analysis");
  }
};

module.exports = analyzeATS;