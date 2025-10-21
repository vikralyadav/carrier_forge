import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const matchJob = async (resumeText, jobDescription) => {
  try {
    if (!resumeText || !jobDescription) {
      throw new Error('Resume text and job description are required');
    }
    
    if (resumeText.trim().length < 50) {
      throw new Error('Resume text is too short to match');
    }
    
    if (jobDescription.trim().length < 20) {
      throw new Error('Job description is too short to match');
    }
    
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
    
    if (!output || output.trim().length === 0) {
      throw new Error('No matching result received from AI');
    }
    
    try {
      return JSON.parse(output);
    } catch (parseError) {
      console.warn('Failed to parse JSON response, returning raw output');
      return { 
        score: null, 
        matched_skills: [], 
        raw_output: output,
        error: 'Failed to parse JSON response'
      };
    }
  } catch (error) {
    console.error('Error matching job:', error);
    throw new Error(`Failed to match job: ${error.message}`);
  }
};

export const matchJobsList = async (resumeText, jobsArray) => {
  try {
    if (!resumeText || !jobsArray || !Array.isArray(jobsArray)) {
      throw new Error('Resume text and jobs array are required');
    }
    
    if (jobsArray.length === 0) {
      throw new Error('Jobs array cannot be empty');
    }
    
    const results = [];
    
    for (const job of jobsArray) {
      try {
        if (!job.description) {
          console.warn(`Job "${job.title}" has no description, skipping`);
          continue;
        }
        
        const match = await matchJob(resumeText, job.description);
        results.push({ 
          job_title: job.title, 
          match,
          company: job.company || 'Unknown'
        });
      } catch (jobError) {
        console.warn(`Failed to match job "${job.title}":`, jobError.message);
        results.push({ 
          job_title: job.title, 
          match: { score: 0, matched_skills: [], error: jobError.message },
          company: job.company || 'Unknown'
        });
      }
    }

    return results.sort((a, b) => (b.match.score || 0) - (a.match.score || 0));
  } catch (error) {
    console.error('Error matching jobs list:', error);
    throw new Error(`Failed to match jobs list: ${error.message}`);
  }
};
