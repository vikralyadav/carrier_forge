import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const generatePortfolio = async (resumeText, jobDescription, portfolioType = 'github') => {
  const prompt = `
You are a professional portfolio consultant and career advisor.

Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

Portfolio Type: ${portfolioType}

TASKS:
1. Generate a tailored portfolio structure for this specific job
2. Suggest 3-5 key projects that align with the job requirements
3. Create project descriptions that highlight relevant skills
4. Provide portfolio optimization tips
5. Suggest technologies and tools to showcase

Return JSON format:
{
  "portfolio_structure": {
    "sections": ["<section1>", "<section2>", "<section3>"],
    "layout": "<suggested layout>"
  },
  "featured_projects": [
    {
      "title": "<project title>",
      "description": "<project description>",
      "technologies": ["<tech1>", "<tech2>"],
      "key_features": ["<feature1>", "<feature2>"],
      "github_url": "<suggested repo structure>",
      "live_demo": "<demo suggestion>"
    }
  ],
  "optimization_tips": [
    "<tip1>",
    "<tip2>",
    "<tip3>"
  ],
  "technologies_to_highlight": ["<tech1>", "<tech2>", "<tech3>"],
  "portfolio_url_suggestion": "<suggested domain/URL>"
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      portfolio_structure: {
        sections: ["About", "Projects", "Skills", "Contact"],
        layout: "Clean and professional"
      },
      featured_projects: [],
      optimization_tips: [output],
      technologies_to_highlight: [],
      portfolio_url_suggestion: "yourname.dev",
      error: "Failed to parse JSON response"
    };
  }
};

export const generateCoverLetter = async (resumeText, jobDescription, companyName = '', position = '') => {
  const prompt = `
You are a professional career coach and cover letter expert.

Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

Company: ${companyName || 'Target Company'}
Position: ${position || 'Target Position'}

TASKS:
1. Write a compelling, personalized cover letter
2. Highlight relevant experience from the resume
3. Address specific job requirements
4. Show enthusiasm and cultural fit
5. Keep it concise but impactful (3-4 paragraphs)

Return JSON format:
{
  "cover_letter": "<full cover letter text>",
  "key_points": [
    "<key point 1>",
    "<key point 2>",
    "<key point 3>"
  ],
  "tone": "<professional|enthusiastic|confident>",
  "word_count": <number>,
  "customization_notes": [
    "<note about how it was customized>"
  ]
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      cover_letter: output,
      key_points: [],
      tone: "professional",
      word_count: output.split(' ').length,
      customization_notes: ["Generated based on resume and job description"],
      error: "Failed to parse JSON response"
    };
  }
};

export const generateProjectIdeas = async (resumeText, jobDescription, skillLevel = 'intermediate') => {
  const prompt = `
You are a project consultant helping developers build impressive portfolios.

Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

Skill Level: ${skillLevel}

TASKS:
1. Suggest 5 portfolio projects that align with the job
2. Include projects of varying complexity
3. Focus on technologies mentioned in the job description
4. Provide clear project descriptions and goals
5. Suggest timeline and resources needed

Return JSON format:
{
  "project_ideas": [
    {
      "title": "<project title>",
      "description": "<detailed description>",
      "technologies": ["<tech1>", "<tech2>"],
      "difficulty": "<beginner|intermediate|advanced>",
      "timeline": "<estimated time>",
      "key_learning": "<what skills this develops>",
      "portfolio_value": "<why this helps get the job>"
    }
  ],
  "learning_path": [
    "<step1>",
    "<step2>",
    "<step3>"
  ],
  "resources": [
    "<resource1>",
    "<resource2>"
  ]
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      project_ideas: [],
      learning_path: [],
      resources: [output],
      error: "Failed to parse JSON response"
    };
  }
};

export const optimizeLinkedInProfile = async (resumeText, jobDescription) => {
  const prompt = `
You are a LinkedIn optimization expert and career strategist.

Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

TASKS:
1. Create an optimized LinkedIn headline
2. Write a compelling summary section
3. Suggest key skills to highlight
4. Provide networking strategies
5. Recommend content to share

Return JSON format:
{
  "headline": "<optimized LinkedIn headline>",
  "summary": "<LinkedIn summary text>",
  "key_skills": ["<skill1>", "<skill2>", "<skill3>"],
  "networking_tips": [
    "<tip1>",
    "<tip2>"
  ],
  "content_suggestions": [
    "<content idea 1>",
    "<content idea 2>"
  ],
  "optimization_score": "<1-10 rating>"
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      headline: "Professional in " + jobDescription.split(' ')[0] + " field",
      summary: output,
      key_skills: [],
      networking_tips: [],
      content_suggestions: [],
      optimization_score: "7",
      error: "Failed to parse JSON response"
    };
  }
};
