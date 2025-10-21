import express from 'express';
import { matchJob, matchJobsList } from '../agents/jobMatcherAgent.js';
import { createLogger } from '../core/logger.js';

const router = express.Router();
const logger = createLogger('jobMatcher');

// POST /api/jobs/match
router.post('/match', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        error: 'Resume text and job description are required' 
      });
    }

    logger.info('Starting job matching');

    const match = await matchJob(resumeText, jobDescription);
    
    res.json({
      success: true,
      data: {
        match,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Job matching failed', error);
    res.status(500).json({ 
      error: 'Failed to match job',
      message: error.message 
    });
  }
});

// POST /api/jobs/match-multiple
router.post('/match-multiple', async (req, res) => {
  try {
    const { resumeText, jobs } = req.body;
    
    if (!resumeText || !jobs || !Array.isArray(jobs)) {
      return res.status(400).json({ 
        error: 'Resume text and jobs array are required' 
      });
    }

    logger.info('Starting multiple job matching', { jobCount: jobs.length });

    const matches = await matchJobsList(resumeText, jobs);
    
    res.json({
      success: true,
      data: {
        matches,
        totalJobs: jobs.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Multiple job matching failed', error);
    res.status(500).json({ 
      error: 'Failed to match jobs',
      message: error.message 
    });
  }
});

// GET /api/jobs/health
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Job Matcher',
    timestamp: new Date().toISOString()
  });
});

export default router;
