const Groq = require("groq-sdk");

const parseResumeWithAI = async (rawText, targetRole = "") => {
  // Initialize inside function so dotenv is already loaded
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const targetRolePrompt = targetRole
    ? `The candidate is targeting the role: "${targetRole}". Factor this into your analysis.`
    : "";

  const prompt = `You are an expert resume parser and career coach. Analyze the following resume text and return ONLY a valid JSON object (no markdown):
{
  "name": "", "email": "", "phone": "",
  "skills": [], "experience": [], "education": [],
  "projects": [], "suggestedRoles": [],
  "strengthAreas": [], "weakAreas": [],
  "interviewReadiness": 75, "summary": ""
}

${targetRolePrompt}
Resume: """${rawText}"""`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 2000,
  });

  const responseText = response.choices[0].message.content.trim();
  const cleaned = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned);
};

module.exports = { parseResumeWithAI };