import express from 'express';
import { generateFollowUpEmail, createPracticeSchedule, generateApplicationTracker, createInterviewPrepPlan } from '../agents/schedulerAgent.js';
import { createLogger } from '../core/logger.js';

const router = express.Router();
const logger = createLogger('scheduler');

// POST /api/scheduler/followup
router.post('/followup', async (req, res) => {
  try {
    const { interviewType, companyName, position, daysSinceInterview = 3 } = req.body;
    
    if (!interviewType || !companyName || !position) {
      return res.status(400).json({ 
        error: 'Interview type, company name, and position are required' 
      });
    }

    logger.info('Generating follow-up email', { interviewType, companyName, position });

    const followUp = await generateFollowUpEmail(interviewType, companyName, position, daysSinceInterview);
    
    res.json({
      success: true,
      data: {
        followUp,
        interviewType,
        companyName,
        position,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Follow-up email generation failed', error);
    res.status(500).json({ 
      error: 'Failed to generate follow-up email',
      message: error.message 
    });
  }
});

// POST /api/scheduler/practice-schedule
router.post('/practice-schedule', async (req, res) => {
  try {
    const { userProfile, goals, timeAvailable } = req.body;
    
    if (!userProfile || !goals || !timeAvailable) {
      return res.status(400).json({ 
        error: 'User profile, goals, and time available are required' 
      });
    }

    logger.info('Creating practice schedule', { timeAvailable });

    const schedule = await createPracticeSchedule(userProfile, goals, timeAvailable);
    
    res.json({
      success: true,
      data: {
        schedule,
        userProfile,
        goals,
        timeAvailable,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Practice schedule creation failed', error);
    res.status(500).json({ 
      error: 'Failed to create practice schedule',
      message: error.message 
    });
  }
});

// POST /api/scheduler/application-tracker
router.post('/application-tracker', async (req, res) => {
  try {
    const { applications } = req.body;
    
    if (!applications || !Array.isArray(applications)) {
      return res.status(400).json({ 
        error: 'Applications array is required' 
      });
    }

    logger.info('Analyzing applications', { applicationCount: applications.length });

    const tracker = await generateApplicationTracker(applications);
    
    res.json({
      success: true,
      data: {
        tracker,
        totalApplications: applications.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Application tracking failed', error);
    res.status(500).json({ 
      error: 'Failed to analyze applications',
      message: error.message 
    });
  }
});

// POST /api/scheduler/interview-prep
router.post('/interview-prep', async (req, res) => {
  try {
    const { jobDescription, interviewType, timeUntilInterview } = req.body;
    
    if (!jobDescription || !interviewType || !timeUntilInterview) {
      return res.status(400).json({ 
        error: 'Job description, interview type, and time until interview are required' 
      });
    }

    logger.info('Creating interview prep plan', { interviewType, timeUntilInterview });

    const prepPlan = await createInterviewPrepPlan(jobDescription, interviewType, timeUntilInterview);
    
    res.json({
      success: true,
      data: {
        prepPlan,
        jobDescription,
        interviewType,
        timeUntilInterview,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Interview prep plan creation failed', error);
    res.status(500).json({ 
      error: 'Failed to create interview prep plan',
      message: error.message 
    });
  }
});

// GET /api/scheduler/health
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Career Scheduler',
    timestamp: new Date().toISOString()
  });
});

export default router;
