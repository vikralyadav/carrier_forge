import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const generateFollowUpEmail = async (interviewType, companyName, position, daysSinceInterview = 3) => {
  const prompt = `
You are a professional career coach and communication expert.

Interview Type: ${interviewType}
Company: ${companyName}
Position: ${position}
Days Since Interview: ${daysSinceInterview}

TASKS:
1. Write a professional follow-up email
2. Express continued interest in the position
3. Reference specific points from the interview
4. Keep it concise and professional
5. Include a clear call-to-action

Return JSON format:
{
  "subject_line": "<email subject>",
  "email_body": "<full email text>",
  "tone": "<professional|enthusiastic|grateful>",
  "key_points": [
    "<point1>",
    "<point2>"
  ],
  "call_to_action": "<what you're asking for>",
  "timing_notes": "<notes about timing>"
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      subject_line: `Thank you for the ${interviewType} interview - ${position}`,
      email_body: output,
      tone: "professional",
      key_points: [],
      call_to_action: "Next steps in the process",
      timing_notes: `Sent ${daysSinceInterview} days after interview`,
      error: "Failed to parse JSON response"
    };
  }
};

export const createPracticeSchedule = async (userProfile, goals, timeAvailable) => {
  const prompt = `
You are a career development coach and scheduling expert.

User Profile:
---
${userProfile}
---

Goals:
---
${goals}
---

Time Available: ${timeAvailable}

TASKS:
1. Create a personalized practice schedule
2. Balance different types of practice (technical, behavioral, portfolio)
3. Include realistic time commitments
4. Suggest specific activities for each session
5. Provide a 4-week roadmap

Return JSON format:
{
  "weekly_schedule": {
    "monday": {
      "activity": "<activity>",
      "duration": "<time>",
      "focus": "<skill focus>"
    },
    "tuesday": {
      "activity": "<activity>",
      "duration": "<time>",
      "focus": "<skill focus>"
    }
  },
  "monthly_roadmap": [
    {
      "week": 1,
      "focus": "<main focus>",
      "goals": ["<goal1>", "<goal2>"],
      "deliverables": ["<deliverable1>", "<deliverable2>"]
    }
  ],
  "practice_activities": [
    {
      "type": "<technical|behavioral|portfolio>",
      "activity": "<specific activity>",
      "duration": "<time>",
      "frequency": "<daily|weekly>"
    }
  ],
  "progress_milestones": [
    "<milestone1>",
    "<milestone2>"
  ]
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      weekly_schedule: {},
      monthly_roadmap: [],
      practice_activities: [],
      progress_milestones: [output],
      error: "Failed to parse JSON response"
    };
  }
};

export const generateApplicationTracker = async (applications) => {
  const prompt = `
You are a career management expert and application tracking specialist.

Current Applications:
---
${JSON.stringify(applications, null, 2)}
---

TASKS:
1. Analyze application status and patterns
2. Suggest follow-up actions for each application
3. Identify areas for improvement
4. Recommend next steps
5. Create a priority ranking

Return JSON format:
{
  "application_analysis": {
    "total_applications": <number>,
    "response_rate": "<percentage>",
    "average_response_time": "<days>",
    "common_rejection_reasons": ["<reason1>", "<reason2>"]
  },
  "follow_up_actions": [
    {
      "company": "<company name>",
      "action": "<specific action>",
      "priority": "<high|medium|low>",
      "deadline": "<date>"
    }
  ],
  "improvement_suggestions": [
    "<suggestion1>",
    "<suggestion2>"
  ],
  "next_steps": [
    "<step1>",
    "<step2>"
  ],
  "priority_rankings": [
    {
      "company": "<company>",
      "position": "<position>",
      "priority_score": <1-10>,
      "reason": "<why this is high priority>"
    }
  ]
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      application_analysis: {
        total_applications: applications.length,
        response_rate: "Unknown",
        average_response_time: "Unknown",
        common_rejection_reasons: []
      },
      follow_up_actions: [],
      improvement_suggestions: [output],
      next_steps: [],
      priority_rankings: [],
      error: "Failed to parse JSON response"
    };
  }
};

export const createInterviewPrepPlan = async (jobDescription, interviewType, timeUntilInterview) => {
  const prompt = `
You are an interview preparation expert and career coach.

Job Description:
---
${jobDescription}
---

Interview Type: ${interviewType}
Time Until Interview: ${timeUntilInterview}

TASKS:
1. Create a comprehensive interview prep plan
2. Include technical and behavioral preparation
3. Suggest specific questions to practice
4. Provide research recommendations
5. Create a timeline leading up to the interview

Return JSON format:
{
  "prep_timeline": [
    {
      "days_before": <number>,
      "activities": ["<activity1>", "<activity2>"],
      "focus_area": "<technical|behavioral|research>",
      "time_required": "<hours>"
    }
  ],
  "technical_prep": {
    "topics_to_review": ["<topic1>", "<topic2>"],
    "coding_practice": ["<problem1>", "<problem2>"],
    "system_design_topics": ["<topic1>", "<topic2>"]
  },
  "behavioral_prep": {
    "star_stories": [
      {
        "situation": "<situation type>",
        "story_outline": "<brief outline>",
        "key_points": ["<point1>", "<point2>"]
      }
    ],
    "common_questions": ["<question1>", "<question2>"]
  },
  "company_research": {
    "key_facts": ["<fact1>", "<fact2>"],
    "recent_news": ["<news1>", "<news2>"],
    "questions_to_ask": ["<question1>", "<question2>"]
  },
  "confidence_builders": [
    "<tip1>",
    "<tip2>"
  ]
}
`;

  const output = await ollamaClient.generate(prompt);
  
  try {
    return JSON.parse(output);
  } catch (error) {
    return {
      prep_timeline: [],
      technical_prep: {
        topics_to_review: [],
        coding_practice: [],
        system_design_topics: []
      },
      behavioral_prep: {
        star_stories: [],
        common_questions: []
      },
      company_research: {
        key_facts: [],
        recent_news: [],
        questions_to_ask: []
      },
      confidence_builders: [output],
      error: "Failed to parse JSON response"
    };
  }
};
