#!/usr/bin/env node

/**
 * CareerForge API Test Script
 * 
 * This script tests all API endpoints to ensure they work correctly
 * Run with: node test-api.js
 */

import axios from 'axios';
import { createLogger } from './src/core/logger.js';

const logger = createLogger('api-test');
const BASE_URL = 'http://localhost:3000';

// Test data
const testResumeText = `
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

const testJobDescription = `
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

const testCode = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
`;

// Test functions
async function testHealthEndpoint() {
  try {
    logger.info('Testing health endpoint...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    
    if (response.status === 200 && response.data.status === 'OK') {
      logger.info('Health endpoint working');
      return true;
    } else {
      logger.error('Health endpoint failed');
      return false;
    }
  } catch (error) {
    logger.error('Health endpoint error:', error.message);
    return false;
  }
}

async function testResumeAnalysis() {
  try {
    logger.info('Testing resume analysis...');
    const response = await axios.post(`${BASE_URL}/api/resume/optimize`, {
      resumeText: testResumeText,
      jobDescription: testJobDescription
    });
    
    if (response.status === 200 && response.data.success) {
      logger.info('Resume analysis working');
      return true;
    } else {
      logger.error('Resume analysis failed');
      return false;
    }
  } catch (error) {
    logger.error('Resume analysis error:', error.message);
    return false;
  }
}

async function testJobMatching() {
  try {
    logger.info('Testing job matching...');
    const response = await axios.post(`${BASE_URL}/api/jobs/match`, {
      resumeText: testResumeText,
      jobDescription: testJobDescription
    });
    
    if (response.status === 200 && response.data.success) {
      logger.info('Job matching working');
      return true;
    } else {
      logger.error('Job matching failed');
      return false;
    }
  } catch (error) {
    logger.error('Job matching error:', error.message);
    return false;
  }
}

async function testInterviewCoaching() {
  try {
    logger.info('Testing interview coaching...');
    
    // Test behavioral question
    const questionResponse = await axios.post(`${BASE_URL}/api/interview/behavioral`, {
      mode: 'question'
    });
    
    if (questionResponse.status === 200 && questionResponse.data.success) {
      logger.info('Interview question generation working');
      
      // Test feedback
      const feedbackResponse = await axios.post(`${BASE_URL}/api/interview/behavioral`, {
        mode: 'feedback',
        userAnswer: 'In my previous role, I led a team of 3 developers to deliver a critical feature. I organized daily standups, delegated tasks based on strengths, and ensured we met our deadline. The feature was successfully deployed and increased user engagement by 25%.'
      });
      
      if (feedbackResponse.status === 200 && feedbackResponse.data.success) {
        logger.info('Interview feedback working');
        return true;
      } else {
        logger.error('Interview feedback failed');
        return false;
      }
    } else {
      logger.error('Interview question generation failed');
      return false;
    }
  } catch (error) {
    logger.error('Interview coaching error:', error.message);
    return false;
  }
}

async function testCodeReview() {
  try {
    logger.info('Testing code review...');
    const response = await axios.post(`${BASE_URL}/api/code/review`, {
      code: testCode,
      language: 'javascript',
      reviewType: 'general'
    });
    
    if (response.status === 200 && response.data.success) {
      logger.info('Code review working');
      return true;
    } else {
      logger.error('Code review failed');
      return false;
    }
  } catch (error) {
    logger.error('Code review error:', error.message);
    return false;
  }
}

async function testPortfolioGeneration() {
  try {
    logger.info('Testing portfolio generation...');
    const response = await axios.post(`${BASE_URL}/api/portfolio/generate`, {
      resumeText: testResumeText,
      jobDescription: testJobDescription,
      portfolioType: 'github'
    });
    
    if (response.status === 200 && response.data.success) {
      logger.info('Portfolio generation working');
      return true;
    } else {
      logger.error('Portfolio generation failed');
      return false;
    }
  } catch (error) {
    logger.error('Portfolio generation error:', error.message);
    return false;
  }
}

async function testScheduler() {
  try {
    logger.info('Testing scheduler...');
    const response = await axios.post(`${BASE_URL}/api/scheduler/followup`, {
      interviewType: 'technical',
      companyName: 'TechCorp Inc.',
      position: 'Senior Full Stack Developer',
      daysSinceInterview: 3
    });
    
    if (response.status === 200 && response.data.success) {
      logger.info('Scheduler working');
      return true;
    } else {
      logger.error('Scheduler failed');
      return false;
    }
  } catch (error) {
    logger.error('Scheduler error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Starting CareerForge API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthEndpoint },
    { name: 'Resume Analysis', fn: testResumeAnalysis },
    { name: 'Job Matching', fn: testJobMatching },
    { name: 'Interview Coaching', fn: testInterviewCoaching },
    { name: 'Code Review', fn: testCodeReview },
    { name: 'Portfolio Generation', fn: testPortfolioGeneration },
    { name: 'Scheduler', fn: testScheduler }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      
      if (result) {
        console.log(`✅ ${test.name}: PASSED`);
      } else {
        console.log(`❌ ${test.name}: FAILED`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! CareerForge is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs for details.');
  }
  
  return results;
}

// Run tests
runAllTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
