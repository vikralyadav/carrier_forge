import { analyzeResume } from "./resumeAgent.js";
import { matchJobsList } from "./jobMatcherAgent.js";
import { createOllamaClient } from "../core/ollamaClient.js";


const ollamaClient = createOllamaClient("mistral");


export const runCareerForgeWorkflow = async (resumeText, jobsArray) => {
  const firstJob = jobsArray[0];
  const resumeAnalysis = await analyzeResume(resumeText, firstJob.description);


  const jobMatches = await matchJobsList(resumeText, jobsArray);


  const prompt = `
You are a career AI assistant.

Resume Analysis Summary:
${resumeAnalysis}

Top Job Matches:
${JSON.stringify(jobMatches, null, 2)}

TASK:
Provide 3 actionable tips for the candidate to improve their chances for all matched jobs.
Return JSON with field "career_tips": [...]
`;
  const careerTipsRaw = await ollamaClient.generate(prompt);

  let careerTips = [];
  try {
    careerTips = JSON.parse(careerTipsRaw).career_tips || [];
  } catch {
    careerTips = [careerTipsRaw]; 
  }

  return {
    resumeAnalysis,
    jobMatches,
    careerTips
  };
};
