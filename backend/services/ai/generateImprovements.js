const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});
const generateImprovements = async (
  resumeData,
  targetRole
) => {
  try {
    const prompt = `
You are an expert resume optimization AI.

Improve this resume professionally.

Target Role:
${targetRole}

Resume Data:
${JSON.stringify(resumeData)}

Return ONLY valid JSON:

{
  "betterSummary": "",
  "betterBulletPoints": [],
  "quantifiedSuggestions": [],
  "formattingFixes": []
}
`;

    const response =
      await openai.chat.completions.create({
       model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You are a professional recruiter and ATS optimizer.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.4,
      });

   const raw =
response.choices[0].message.content;

const cleaned =
raw
.replace(/`json/g, "")
    .replace(/`/g, "")
.trim();

return JSON.parse(cleaned);

  } catch (error) {
    console.error(
      "Improvement Generation Error:",
      error
    );

    throw new Error(
      "Failed to generate improvements"
    );
  }
};

module.exports = generateImprovements;