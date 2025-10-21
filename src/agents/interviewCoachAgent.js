import { createOllamaClient } from "../core/ollamaClient.js";

export async function interviewCoach(mode, userAnswer = null) {
  try {
    if (!mode) {
      throw new Error('Mode is required');
    }
    
    const ollama = createOllamaClient(); 

    if (mode === "behavioral") {
      if (!userAnswer) {
        const prompt = `
        You are an experienced HR interviewer.
        Ask one challenging behavioral interview question for a software developer.
        Focus on teamwork, conflict resolution, or leadership.
        `;

        const res = await ollama.generate(prompt);
        
        if (!res || res.trim().length === 0) {
          throw new Error('No question generated');
        }
        
        return { type: "question", message: res.trim() };
      } else {
        if (userAnswer.trim().length < 10) {
          throw new Error('User answer is too short for meaningful feedback');
        }
        
        const prompt = `
        You are an HR evaluator.
        Here's the candidate's answer:
        "${userAnswer}"

        Evaluate it using the STAR (Situation, Task, Action, Result) framework.
        Respond in JSON format:
        {
          "score": <0-10>,
          "feedback": "<specific suggestions for improvement>"
        }
        `;

        const res = await ollama.generate(prompt);
        
        if (!res || res.trim().length === 0) {
          throw new Error('No feedback generated');
        }
        
        return { type: "feedback", message: res.trim() };
      }
    }

    else if (mode === "technical") {
      const prompt = `
      You are a technical interviewer.
      Ask one coding question suitable for a software developer with 1–2 years of experience.
      Return a JSON with:
      {
        "question": "<question>",
        "difficulty": "<easy | medium | hard>"
      }
      `;

      const res = await ollama.generate(prompt);
      
      if (!res || res.trim().length === 0) {
        throw new Error('No technical question generated');
      }
      
      return { type: "technical", message: res.trim() };
    }

    else {
      return { type: "error", message: "Invalid mode. Use 'behavioral' or 'technical'." };
    }
  } catch (error) {
    console.error('Error in interview coach:', error);
    return { 
      type: "error", 
      message: `Interview coach error: ${error.message}` 
    };
  }
}
