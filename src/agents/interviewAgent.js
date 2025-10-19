import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");


export const runBehavioralInterview = async (questions, context) => {
  const results = [];

  for (const q of questions) {
    const prompt = `
You are a professional interview coach.

Candidate Info:
${JSON.stringify(context, null, 2)}

Question:
${q}

TASK:
1. Evaluate the candidate's response (simulate a placeholder answer for testing if none provided)
2. Provide constructive feedback
3. Suggest improvements for STAR method

Return JSON:
{
  "question": "...",
  "sample_answer": "...",
  "feedback": "..."
}
`;

    const output = await ollamaClient.generate(prompt, {stream: false, maxTokens: 100});
    try {
      results.push(JSON.parse(output));
    } catch {
      results.push({ question: q, raw_output: output });
    }
  }

  return results;
};

export const runTechnicalInterview = async (questions) => {
  const results = [];

  for (const q of questions) {
    const prompt = `
You are a senior software engineer conducting a technical interview.

Question:
${q.question}

TASK:
1. Evaluate the candidate's solution (if none, simulate a placeholder)
2. Suggest improvements and optimal approach
3. Provide step-by-step explanation

Return JSON:
{
  "question": "...",
  "sample_solution": "...",
  "feedback": "..."
}
`;

    const output = await ollamaClient.generate(prompt);
    try {
      results.push(JSON.parse(output));
    } catch {
      results.push({ question: q.question, raw_output: output });
    }
  }

  return results;
};
