import express from 'express';
import multer from 'multer';
import { extractResumeText, extractResumeTextFromBuffer, analyzeResume } from '../agents/resumeAgent.js';
import { createLogger } from '../core/logger.js';

const router = express.Router();
const logger = createLogger('resume');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/resume/analyze
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file provided' });
    }

    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    logger.info('Starting resume analysis', { 
      filename: req.file.originalname,
      size: req.file.size 
    });

    // Extract text from PDF buffer
    const resumeText = await extractResumeTextFromBuffer(req.file.buffer);
    
    // Analyze resume against job description
    const analysis = await analyzeResume(resumeText, jobDescription);

    logger.info('Resume analysis completed');

    res.json({
      success: true,
      data: {
        resumeText,
        analysis: typeof analysis === 'string' ? JSON.parse(analysis) : analysis
      }
    });

  } catch (error) {
    logger.error('Resume analysis failed', error);
    
    // Provide more specific error messages
    let statusCode = 500;
    let errorMessage = 'Failed to analyze resume';
    
    if (error.message.includes('PDF buffer is required') || 
        error.message.includes('Input must be a Buffer')) {
      statusCode = 400;
      errorMessage = 'Invalid file upload - please upload a valid PDF file';
    } else if (error.message.includes('File does not appear to be a valid PDF')) {
      statusCode = 400;
      errorMessage = 'Invalid file format - please upload a valid PDF file';
    } else if (error.message.includes('No text content found in PDF')) {
      statusCode = 400;
      errorMessage = 'PDF contains no extractable text - please ensure the PDF has selectable text';
    } else if (error.message.includes('Job description is required')) {
      statusCode = 400;
      errorMessage = 'Job description is required';
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/resume/optimize
router.post('/optimize', async (req, res) => {
  try {
    const { resumeText, jobDescription, optimizationType = 'ats' } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ 
        error: 'Resume text and job description are required' 
      });
    }

    logger.info('Starting resume optimization', { optimizationType });

    const analysis = await analyzeResume(resumeText, jobDescription);
    
    res.json({
      success: true,
      data: {
        optimization: typeof analysis === 'string' ? JSON.parse(analysis) : analysis,
        type: optimizationType
      }
    });

  } catch (error) {
    logger.error('Resume optimization failed', error);
    
    // Provide more specific error messages
    let statusCode = 500;
    let errorMessage = 'Failed to optimize resume';
    
    if (error.message.includes('Resume text and job description are required')) {
      statusCode = 400;
      errorMessage = 'Resume text and job description are required';
    } else if (error.message.includes('Resume text is too short')) {
      statusCode = 400;
      errorMessage = 'Resume text is too short to analyze';
    } else if (error.message.includes('Job description is too short')) {
      statusCode = 400;
      errorMessage = 'Job description is too short to analyze';
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
