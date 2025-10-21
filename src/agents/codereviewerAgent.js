import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const reviewCode = async (code, language = 'javascript', reviewType = 'general') => {
  const prompt = `
You are an expert code reviewer and software engineer.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Review Type: ${reviewType}

TASKS:
1. Analyze the code for bugs, performance issues, and best practices
2. Check for security vulnerabilities
3. Suggest improvements and optimizations
4. Rate the code quality from 1-10
5. Provide specific, actionable feedback

Return JSON format:
{
  "score": <1-10>,
  "issues": [
    {
      "type": "bug|performance|security|style",
      "severity": "low|medium|high|critical",
      "line": <line_number>,
      "description": "<issue description>",
      "suggestion": "<how to fix>"
    }
  ],
  "suggestions": [
    "<improvement suggestion>"
  ],
  "overall_feedback": "<summary of code quality and recommendations>"
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      score: null,
      issues: [],
      suggestions: [],
      overall_feedback: output,
      error: "Failed to parse JSON response"
    };
  }
};

export const generateCodeSnippet = async (description, language = 'javascript', context = '') => {
  const prompt = `
You are an expert software developer.

Task: ${description}
Language: ${language}
Context: ${context}

TASKS:
1. Generate clean, production-ready code
2. Include proper error handling
3. Add helpful comments
4. Follow best practices for ${language}
5. Make it efficient and readable

Return JSON format:
{
  "code": "<generated code>",
  "explanation": "<what the code does>",
  "complexity": "<time/space complexity>",
  "usage": "<how to use this code>"
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      code: output,
      explanation: "Generated code snippet",
      complexity: "Unknown",
      usage: "See code comments",
      error: "Failed to parse JSON response"
    };
  }
};

export const refactorCode = async (code, language = 'javascript', refactorType = 'optimize') => {
  const prompt = `
You are an expert software engineer specializing in code refactoring.

Original Code:
\`\`\`${language}
${code}
\`\`\`

Refactor Type: ${refactorType}

TASKS:
1. Refactor the code to improve ${refactorType}
2. Maintain the same functionality
3. Improve readability and maintainability
4. Optimize performance if applicable
5. Add proper error handling if missing

Return JSON format:
{
  "original_code": "<original code>",
  "refactored_code": "<improved code>",
  "improvements": [
    "<list of improvements made>"
  ],
  "explanation": "<what was changed and why>"
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      original_code: code,
      refactored_code: output,
      improvements: ["Code refactored"],
      explanation: "Code has been refactored",
      error: "Failed to parse JSON response"
    };
  }
};

export const runStaticAnalysis = async (code, language = 'javascript') => {
  const prompt = `
You are a static analysis tool for ${language} code.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

TASKS:
1. Check for common code smells
2. Identify potential bugs
3. Analyze code complexity
4. Check for security issues
5. Verify coding standards compliance

Return JSON format:
{
  "complexity_score": <1-10>,
  "code_smells": [
    {
      "type": "<smell type>",
      "description": "<description>",
      "severity": "<low|medium|high>"
    }
  ],
  "potential_bugs": [
    {
      "line": <line_number>,
      "description": "<bug description>",
      "severity": "<low|medium|high|critical>"
    }
  ],
  "security_issues": [
    {
      "type": "<security issue type>",
      "description": "<description>",
      "severity": "<low|medium|high|critical>"
    }
  ],
  "recommendations": [
    "<improvement recommendation>"
  ]
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      complexity_score: null,
      code_smells: [],
      potential_bugs: [],
      security_issues: [],
      recommendations: [output],
      error: "Failed to parse JSON response"
    };
  }
};
