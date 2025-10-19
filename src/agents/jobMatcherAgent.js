import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const matchJob = async (resumeText, jobDescription) => {
  const prompt = `
You are a career AI assistant.

Resume:
---
${resumeText}

Job Description:
---
${jobDescription}

TASKS:
1. Evaluate how well the candidate's skills match this job.
2. Return a SIMILARITY SCORE between 0 and 1 (1 = perfect fit)
3. List the top 5 matching skills/keywords.

Return JSON like this:
{
  "score": 0.87,
  "matched_skills": ["JavaScript", "Node.js", "React"]
}
`;

  const output = await ollamaClient.generate(prompt);
  try {
    return JSON.parse(output);
  } catch (e) {

    return { score: null, matched_skills: [], raw_output: output };
  }
};

export const matchJobsList = async (resumeText, jobsArray) => {
  const results = [];
  for (const job of jobsArray) {
    const match = await matchJob(resumeText, job.description);
    results.push({ job_title: job.title, match });
  }

  return results.sort((a, b) => (b.match.score || 0) - (a.match.score || 0));
};
