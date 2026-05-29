const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});
const extractResumeData = async (resumeText) => {
  try {
    const prompt = `
Extract all information from this resume.

Return ONLY valid JSON.

Required fields:
{
  "name": "",
  "email": "",
  "phone": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "location": "",
  "summary": "",
  "skills": [],
  "softSkills": [],
  "tools": [],
  "certifications": [],
  "achievements": [],
  "languages": [],
  "experience": [],
  "education": [],
  "projects": []
}

Resume:
${resumeText}
`;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are a professional resume parser. Return only clean JSON.",
        },

        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,
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
    console.error("Resume Extraction Error:", error);
    throw new Error("Failed to extract resume data");
  }
};

module.exports = extractResumeData;