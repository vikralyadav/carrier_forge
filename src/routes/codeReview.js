import express from 'express';
import { reviewCode, generateCodeSnippet, refactorCode, runStaticAnalysis } from '../agents/codereviewerAgent.js';
import { createLogger } from '../core/logger.js';

const router = express.Router();
const logger = createLogger('codeReview');

// POST /api/code/review
router.post('/review', async (req, res) => {
  try {
    const { code, language = 'javascript', reviewType = 'general' } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Code is required' 
      });
    }

    logger.info('Starting code review', { language, reviewType });

    const review = await reviewCode(code, language, reviewType);
    
    res.json({
      success: true,
      data: {
        review,
        language,
        reviewType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Code review failed', error);
    res.status(500).json({ 
      error: 'Failed to review code',
      message: error.message 
    });
  }
});

// POST /api/code/generate
router.post('/generate', async (req, res) => {
  try {
    const { description, language = 'javascript', context = '' } = req.body;
    
    if (!description) {
      return res.status(400).json({ 
        error: 'Description is required' 
      });
    }

    logger.info('Starting code generation', { language });

    const snippet = await generateCodeSnippet(description, language, context);
    
    res.json({
      success: true,
      data: {
        snippet,
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Code generation failed', error);
    res.status(500).json({ 
      error: 'Failed to generate code',
      message: error.message 
    });
  }
});

// POST /api/code/refactor
router.post('/refactor', async (req, res) => {
  try {
    const { code, language = 'javascript', refactorType = 'optimize' } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Code is required' 
      });
    }

    logger.info('Starting code refactoring', { language, refactorType });

    const refactored = await refactorCode(code, language, refactorType);
    
    res.json({
      success: true,
      data: {
        refactored,
        language,
        refactorType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Code refactoring failed', error);
    res.status(500).json({ 
      error: 'Failed to refactor code',
      message: error.message 
    });
  }
});

// POST /api/code/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Code is required' 
      });
    }

    logger.info('Starting static analysis', { language });

    const analysis = await runStaticAnalysis(code, language);
    
    res.json({
      success: true,
      data: {
        analysis,
        language,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Static analysis failed', error);
    res.status(500).json({ 
      error: 'Failed to analyze code',
      message: error.message 
    });
  }
});

// GET /api/code/health
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Code Reviewer',
    timestamp: new Date().toISOString()
  });
});

export default router;
