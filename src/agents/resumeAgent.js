import fs from "fs-extra";
import { PDFParse } from "pdf-parse";

import { createOllamaClient } from "../core/ollamaClient.js";

const ollamaClient = createOllamaClient("mistral");

export const extractResumeText = async (pdfPath) => {
  try {
    if (!pdfPath) {
      throw new Error('PDF path is required');
    }
    
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await new PDFParse(dataBuffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }
    
    return data.text;
  } catch (error) {
    console.error('Error extracting resume text:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

export const extractResumeTextFromBuffer = async (buffer) => {
  try {
    if (!buffer) {
      throw new Error('PDF buffer is required');
    }
    
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('Input must be a Buffer');
    }
    
    // Basic buffer validation - let PDFParse handle PDF format validation
    if (buffer.length < 10) {
      throw new Error('File is too small to be a valid PDF');
    }
    
    const data = await new PDFParse(buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      // Provide more helpful error message
      const errorMsg = 'No text content found in PDF. This could be because:\n' +
                      '1. The PDF is image-based (scanned document)\n' +
                      '2. The PDF has no selectable text\n' +
                      '3. The PDF is corrupted\n\n' +
                      'Please ensure your resume PDF has selectable text, not just images.';
      throw new Error(errorMsg);
    }
    
    return data.text;
  } catch (error) {
    console.error('Error extracting resume text from buffer:', error);
    throw new Error(`Failed to extract text from PDF buffer: ${error.message}`);
  }
};


export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    if (!resumeText || !jobDescription) {
      throw new Error('Resume text and job description are required');
    }
    
    if (resumeText.trim().length < 50) {
      throw new Error('Resume text is too short to analyze');
    }
    
    if (jobDescription.trim().length < 20) {
      throw new Error('Job description is too short to analyze');
    }
    
    const prompt = `
You are a professional career coach and ATS optimization expert.

Here is a candidate's RESUME:
---
${resumeText}

And here is a JOB DESCRIPTION they want to apply for:
---
${jobDescription}

TASKS:
1. Identify major SKILL GAPS and MISSING KEYWORDS.
2. Suggest ATS optimization tips (phrasing, keyword alignment).
3. Rewrite the "Professional Summary" section to better fit this job.

Return results in this JSON format:
{
  "skill_gaps": [...],
  "ats_tips": "...",
  "rewritten_summary": "..."
}
`;

    const output = await ollamaClient.generate(prompt);
    
    if (!output || output.trim().length === 0) {
      throw new Error('No analysis result received from AI');
    }
    
    return output;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
};
