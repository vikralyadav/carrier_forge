#!/usr/bin/env node

/**
 * CareerForge Demo Script
 * 
 * This script demonstrates the key capabilities of CareerForge
 * Run with: node examples/demo.js
 */

import { extractResumeText, analyzeResume } from '../src/agents/resumeAgent.js';
import { matchJob, matchJobsList } from '../src/agents/jobMatcherAgent.js';
import { interviewCoach } from '../src/agents/interviewCoachAgent.js';
import { reviewCode } from '../src/agents/codereviewerAgent.js';
import { generatePortfolio } from '../src/agents/portfolioAgent.js';
import { generateFollowUpEmail } from '../src/agents/schedulerAgent.js';
import { createLogger } from '../src/core/logger.js';

const logger = createLogger('demo');

// Sample data for demonstration
const sampleResume = `
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 3+ years in full-stack development.
Skilled in JavaScript, React, Node.js, and Python. Passionate about building
scalable web applications and learning new technologies.

TECHNICAL SKILLS
- Programming Languages: JavaScript, Python, Java, TypeScript
- Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Django, Flask
- Databases: MongoDB, PostgreSQL, MySQL
- Tools: Git, Docker, AWS, Jenkins

EXPERIENCE
Software Engineer | TechCorp Inc. | 2021 - Present
- Developed and maintained React-based web applications
- Built RESTful APIs using Node.js and Express
- Collaborated with cross-functional teams in Agile environment
- Improved application performance by 30% through code optimization

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018 - 2021
`;

const sampleJobDescription = `
We are seeking a Senior Full Stack Developer to join our growing team.

REQUIREMENTS:
- 3+ years of experience in full-stack development
- Strong proficiency in JavaScript, React, and Node.js
- Experience with RESTful API development
- Knowledge of database design and optimization
- Familiarity with cloud platforms (AWS preferred)
- Excellent communication and teamwork skills

RESPONSIBILITIES:
- Design and develop scalable web applications
- Collaborate with product managers and designers
- Write clean, maintainable code
- Participate in code reviews and technical discussions
- Mentor junior developers
`;

const sampleJobs = [
  {
    title: "Senior Full Stack Developer",
    description: "React, Node.js, JavaScript, AWS, 3+ years experience"
  },
  {
    title: "Frontend Developer",
    description: "React, TypeScript, CSS, HTML, 2+ years experience"
  },
  {
    title: "Backend Developer",
    description: "Python, Django, PostgreSQL, API development"
  }
];

const sampleCode = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
`;

async function runDemo() {
  console.log('🚀 CareerForge Demo Starting...\n');
  
  try {
    // 1. Resume Analysis Demo
    console.log('📄 === RESUME ANALYSIS ===');
    logger.info('Starting resume analysis demo');
    
    const resumeAnalysis = await analyzeResume(sampleResume, sampleJobDescription);
    console.log('Resume Analysis Result:');
    console.log(JSON.stringify(JSON.parse(resumeAnalysis), null, 2));
    console.log('\n');

    // 2. Job Matching Demo
    console.log('🔍 === JOB MATCHING ===');
    logger.info('Starting job matching demo');
    
    const jobMatches = await matchJobsList(sampleResume, sampleJobs);
    console.log('Job Match Results:');
    jobMatches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.job_title}`);
      console.log(`   Score: ${match.match.score || 'N/A'}`);
      console.log(`   Matched Skills: ${match.match.matched_skills?.join(', ') || 'N/A'}`);
    });
    console.log('\n');

    // 3. Interview Coaching Demo
    console.log('🎯 === INTERVIEW COACHING ===');
    logger.info('Starting interview coaching demo');
    
    const question = await interviewCoach('behavioral');
    console.log('Behavioral Question:');
    console.log(question.message);
    console.log('\n');

    const sampleAnswer = "In my previous role, I led a team of 3 developers to deliver a critical feature. I organized daily standups, delegated tasks based on strengths, and ensured we met our deadline. The feature was successfully deployed and increased user engagement by 25%.";
    const feedback = await interviewCoach('behavioral', sampleAnswer);
    console.log('Feedback on Answer:');
    console.log(feedback.message);
    console.log('\n');

    // 4. Code Review Demo
    console.log('💻 === CODE REVIEW ===');
    logger.info('Starting code review demo');
    
    const codeReview = await reviewCode(sampleCode, 'javascript', 'performance');
    console.log('Code Review Results:');
    console.log(`Score: ${codeReview.score || 'N/A'}`);
    console.log(`Issues: ${codeReview.issues?.length || 0}`);
    console.log(`Suggestions: ${codeReview.suggestions?.length || 0}`);
    if (codeReview.overall_feedback) {
      console.log(`Feedback: ${codeReview.overall_feedback}`);
    }
    console.log('\n');

    // 5. Portfolio Generation Demo
    console.log('🎨 === PORTFOLIO GENERATION ===');
    logger.info('Starting portfolio generation demo');
    
    const portfolio = await generatePortfolio(sampleResume, sampleJobDescription, 'github');
    console.log('Portfolio Suggestions:');
    console.log(`Featured Projects: ${portfolio.featured_projects?.length || 0}`);
    console.log(`Technologies to Highlight: ${portfolio.technologies_to_highlight?.join(', ') || 'N/A'}`);
    if (portfolio.portfolio_url_suggestion) {
      console.log(`Suggested URL: ${portfolio.portfolio_url_suggestion}`);
    }
    console.log('\n');

    // 6. Follow-up Email Demo
    console.log('📧 === FOLLOW-UP EMAIL ===');
    logger.info('Starting follow-up email demo');
    
    const followUp = await generateFollowUpEmail('technical', 'TechCorp Inc.', 'Senior Full Stack Developer', 3);
    console.log('Follow-up Email:');
    console.log(`Subject: ${followUp.subject_line}`);
    console.log(`Body: ${followUp.email_body}`);
    console.log('\n');

    console.log('✅ Demo completed successfully!');
    console.log('\n🎉 CareerForge is ready to help you get hired!');
    console.log('📊 Check the logs/ directory for detailed execution logs');
    console.log('🌐 Start the server with: npm start');
    console.log('🔗 Access the dashboard at: http://localhost:3000');

  } catch (error) {
    logger.error('Demo failed', error);
    console.error('❌ Demo failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Ollama is running: ollama serve');
    console.log('2. Ensure Mistral model is pulled: ollama pull mistral');
    console.log('3. Check the logs/ directory for detailed error information');
  }
}

// Run the demo
runDemo();
