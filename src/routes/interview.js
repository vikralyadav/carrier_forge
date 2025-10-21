import express from 'express';
import { interviewCoach } from '../agents/interviewCoachAgent.js';
import { runBehavioralInterview, runTechnicalInterview } from '../agents/interviewAgent.js';
import { createLogger } from '../core/logger.js';

const router = express.Router();
const logger = createLogger('interview');

// POST /api/interview/behavioral
router.post('/behavioral', async (req, res) => {
  try {
    const { mode, userAnswer, context } = req.body;
    
    if (!mode) {
      return res.status(400).json({ 
        error: 'Mode is required (question or feedback)' 
      });
    }

    logger.info('Starting behavioral interview', { mode });

    let result;
    if (mode === 'question') {
      result = await interviewCoach('behavioral');
    } else if (mode === 'feedback') {
      if (!userAnswer) {
        return res.status(400).json({ 
          error: 'User answer is required for feedback mode' 
        });
      }
      result = await interviewCoach('behavioral', userAnswer);
    } else {
      return res.status(400).json({ 
        error: 'Invalid mode. Use "question" or "feedback"' 
      });
    }
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('Behavioral interview failed', error);
    res.status(500).json({ 
      error: 'Failed to process behavioral interview',
      message: error.message 
    });
  }
});

// POST /api/interview/technical
router.post('/technical', async (req, res) => {
  try {
    const { questions, context } = req.body;
    
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: 'Questions array is required' 
      });
    }

    logger.info('Starting technical interview', { questionCount: questions.length });

    const results = await runTechnicalInterview(questions);
    
    res.json({
      success: true,
      data: {
        results,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Technical interview failed', error);
    res.status(500).json({ 
      error: 'Failed to process technical interview',
      message: error.message 
    });
  }
});

// POST /api/interview/behavioral-batch
router.post('/behavioral-batch', async (req, res) => {
  try {
    const { questions, context } = req.body;
    
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ 
        error: 'Questions array is required' 
      });
    }

    logger.info('Starting batch behavioral interview', { questionCount: questions.length });

    const results = await runBehavioralInterview(questions, context || {});
    
    res.json({
      success: true,
      data: {
        results,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Batch behavioral interview failed', error);
    res.status(500).json({ 
      error: 'Failed to process batch behavioral interview',
      message: error.message 
    });
  }
});

// GET /api/interview/health
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Interview Coach',
    timestamp: new Date().toISOString()
  });
});

export default router;
