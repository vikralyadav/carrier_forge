import express from 'express';
import { generatePortfolio, generateCoverLetter } from '../agents/portfolioAgent.js';
import { createLogger } from '../core/logger.js';

const router = express.Router();
const logger = createLogger('portfolio');

// POST /api/portfolio/generate
router.post('/generate', async (req, res) => {
  try {
    const { resumeText, jobDescription, portfolioType = 'github' } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        error: 'Resume text and job description are required' 
      });
    }

    logger.info('Starting portfolio generation', { portfolioType });

    const portfolio = await generatePortfolio(resumeText, jobDescription, portfolioType);
    
    res.json({
      success: true,
      data: {
        portfolio,
        type: portfolioType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Portfolio generation failed', error);
    res.status(500).json({ 
      error: 'Failed to generate portfolio',
      message: error.message 
    });
  }
});

// POST /api/portfolio/cover-letter
router.post('/cover-letter', async (req, res) => {
  try {
    const { resumeText, jobDescription, companyName, position } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        error: 'Resume text and job description are required' 
      });
    }

    logger.info('Starting cover letter generation', { companyName, position });

    const coverLetter = await generateCoverLetter(
      resumeText, 
      jobDescription, 
      companyName, 
      position
    );
    
    res.json({
      success: true,
      data: {
        coverLetter,
        companyName,
        position,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Cover letter generation failed', error);
    res.status(500).json({ 
      error: 'Failed to generate cover letter',
      message: error.message 
    });
  }
});

// GET /api/portfolio/health
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Portfolio Generator',
    timestamp: new Date().toISOString()
  });
});

export default router;
