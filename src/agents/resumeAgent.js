import fs from "fs-extra";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { PDFParse } from "pdf-parse";

import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const extractResumeText = async (pdfPath) => {
  const dataBuffer = await fs.readFile(pdfPath);

  const data = await new PDFParse(dataBuffer); 
  return data.text;
};


export const analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `
You are a professional career coach and ATS optimization expert.

Here is a candidate’s RESUME:
---
${resumeText}

And here is a JOB DESCRIPTION they want to apply for:
---
${jobDescription}

TASKS:
1. Identify major SKILL GAPS and MISSING KEYWORDS.
2. Suggest ATS optimization tips (phrasing, keyword alignment).
3. Rewrite the "Professional Summary" section to better fit this job.

Return results in this JSON format:
{
  "skill_gaps": [...],
  "ats_tips": "...",
  "rewritten_summary": "..."
}
`;

  const output = await ollamaClient.generate(prompt);
  return output;
};
