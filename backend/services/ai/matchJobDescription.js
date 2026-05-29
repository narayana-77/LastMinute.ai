const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",
});
const matchJobDescription = async (
resumeData,
jobDescription
) => {
try {
const prompt = `
Compare this resume with the job description.

Resume Data:
${JSON.stringify(resumeData)}

Job Description:
${jobDescription}

Return ONLY valid JSON:

{
"matchPercentage": 0,
"matchedKeywords": [],
"missingKeywords": [],
"missingSkills": [],
"recruiterFitAnalysis": "",
"optimizationSuggestions": []
}
`;

```
const response =
  await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content:
          "You are an ATS keyword matching engine and recruiter.",
      },

      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.3,
  });

return JSON.parse(
  response.choices[0].message.content
);
```

} catch (error) {
console.error(
"Job Matching Error:",
error
);

```
throw new Error(
  "Failed job description matching"
);
```

}
};

module.exports = matchJobDescription;
