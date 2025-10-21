import fs from 'fs-extra';
import { PDFParse } from 'pdf-parse';

/**
 * Text extraction utilities for CareerForge
 * Handles various file formats and text processing
 */

/**
 * Extract text from PDF file
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await PDFParse(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
};

/**
 * Extract text from PDF buffer
 */
export const extractTextFromPDFBuffer = async (buffer) => {
    try {
        const data = await PDFParse(buffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF buffer:', error);
        throw new Error(`Failed to extract text from PDF buffer: ${error.message}`);
    }
};

/**
 * Extract text from various file formats
 */
export const extractTextFromFile = async (filePath, mimeType) => {
    const extension = filePath.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf':
            return await extractTextFromPDF(filePath);
        case 'txt':
            return await fs.readFile(filePath, 'utf8');
        case 'md':
            return await fs.readFile(filePath, 'utf8');
        default:
            throw new Error(`Unsupported file format: ${extension}`);
    }
};

/**
 * Clean and normalize extracted text
 */
export const cleanText = (text) => {
    if (!text) return '';
    
    return text
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Remove special characters but keep basic punctuation
        .replace(/[^\w\s.,;:!?@()-]/g, '')
        // Remove multiple newlines
        .replace(/\n\s*\n/g, '\n')
        // Trim whitespace
        .trim();
};

/**
 * Extract structured information from resume text
 */
export const extractResumeStructure = (resumeText) => {
    const sections = {
        contact: extractContactInfo(resumeText),
        summary: extractSummary(resumeText),
        experience: extractExperience(resumeText),
        education: extractEducation(resumeText),
        skills: extractSkills(resumeText),
        projects: extractProjects(resumeText)
    };
    
    return sections;
};

/**
 * Extract contact information
 */
const extractContactInfo = (text) => {
    const contact = {
        email: extractEmail(text),
        phone: extractPhone(text),
        location: extractLocation(text),
        linkedin: extractLinkedIn(text),
        github: extractGitHub(text)
    };
    
    return contact;
};

/**
 * Extract email addresses
 */
const extractEmail = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex);
    return emails ? emails[0] : null;
};

/**
 * Extract phone numbers
 */
const extractPhone = (text) => {
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const phones = text.match(phoneRegex);
    return phones ? phones[0] : null;
};

/**
 * Extract location information
 */
const extractLocation = (text) => {
    // Simple location extraction - could be improved with NLP
    const locationPatterns = [
        /([A-Z][a-z]+,\s*[A-Z]{2})/g,
        /([A-Z][a-z]+,\s*[A-Z][a-z]+)/g
    ];
    
    for (const pattern of locationPatterns) {
        const matches = text.match(pattern);
        if (matches && matches.length > 0) {
            return matches[0];
        }
    }
    
    return null;
};

/**
 * Extract LinkedIn profile
 */
const extractLinkedIn = (text) => {
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/g;
    const matches = text.match(linkedinRegex);
    return matches ? matches[0] : null;
};

/**
 * Extract GitHub profile
 */
const extractGitHub = (text) => {
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/g;
    const matches = text.match(githubRegex);
    return matches ? matches[0] : null;
};

/**
 * Extract professional summary
 */
const extractSummary = (text) => {
    const summaryPatterns = [
        /(?:summary|profile|objective|about)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i,
        /(?:professional\s+summary|executive\s+summary)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i
    ];
    
    for (const pattern of summaryPatterns) {
        const match = text.match(pattern);
        if (match) {
            return cleanText(match[0]);
        }
    }
    
    return null;
};

/**
 * Extract work experience
 */
const extractExperience = (text) => {
    const experiencePatterns = [
        /(?:experience|employment|work\s+history|professional\s+experience)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i,
        /(?:employment|work\s+history)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i
    ];
    
    for (const pattern of experiencePatterns) {
        const match = text.match(pattern);
        if (match) {
            return cleanText(match[0]);
        }
    }
    
    return null;
};

/**
 * Extract education information
 */
const extractEducation = (text) => {
    const educationPatterns = [
        /(?:education|academic|qualifications)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i,
        /(?:degree|university|college|school)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i
    ];
    
    for (const pattern of educationPatterns) {
        const match = text.match(pattern);
        if (match) {
            return cleanText(match[0]);
        }
    }
    
    return null;
};

/**
 * Extract skills section
 */
const extractSkills = (text) => {
    const skillsPatterns = [
        /(?:skills|technical\s+skills|technologies|competencies)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i,
        /(?:programming\s+languages|tools|software)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i
    ];
    
    for (const pattern of skillsPatterns) {
        const match = text.match(pattern);
        if (match) {
            return cleanText(match[0]);
        }
    }
    
    return null;
};

/**
 * Extract projects section
 */
const extractProjects = (text) => {
    const projectsPatterns = [
        /(?:projects|portfolio|key\s+projects)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i,
        /(?:notable\s+projects|selected\s+projects)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i
    ];
    
    for (const pattern of projectsPatterns) {
        const match = text.match(pattern);
        if (match) {
            return cleanText(match[0]);
        }
    }
    
    return null;
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text, minLength = 3) => {
    if (!text) return [];
    
    // Remove common stop words
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length >= minLength && !stopWords.has(word));
    
    // Count word frequency
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 50)
        .map(([word]) => word);
};

/**
 * Extract job requirements from job description
 */
export const extractJobRequirements = (jobDescription) => {
    const requirements = {
        skills: extractSkillsFromJobDescription(jobDescription),
        experience: extractExperienceFromJobDescription(jobDescription),
        education: extractEducationFromJobDescription(jobDescription),
        responsibilities: extractResponsibilities(jobDescription)
    };
    
    return requirements;
};

/**
 * Extract skills from job description
 */
const extractSkillsFromJobDescription = (text) => {
    const skillKeywords = [
        'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue', 'typescript',
        'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'docker', 'kubernetes',
        'git', 'github', 'agile', 'scrum', 'api', 'rest', 'graphql', 'microservices'
    ];
    
    const foundSkills = [];
    skillKeywords.forEach(skill => {
        if (text.toLowerCase().includes(skill.toLowerCase())) {
            foundSkills.push(skill);
        }
    });
    
    return foundSkills;
};

/**
 * Extract experience requirements
 */
const extractExperienceFromJobDescription = (text) => {
    const experiencePatterns = [
        /(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi,
        /(\d+)\s*-\s*(\d+)\s*years?\s*(?:of\s*)?experience/gi
    ];
    
    for (const pattern of experiencePatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0];
        }
    }
    
    return null;
};

/**
 * Extract education requirements
 */
const extractEducationFromJobDescription = (text) => {
    const educationKeywords = [
        'bachelor', 'master', 'phd', 'degree', 'diploma', 'certification',
        'computer science', 'engineering', 'mathematics', 'statistics'
    ];
    
    const foundEducation = [];
    educationKeywords.forEach(edu => {
        if (text.toLowerCase().includes(edu.toLowerCase())) {
            foundEducation.push(edu);
        }
    });
    
    return foundEducation;
};

/**
 * Extract job responsibilities
 */
const extractResponsibilities = (text) => {
    const responsibilityPatterns = [
        /(?:responsibilities|duties|what\s+you'll\s+do)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i,
        /(?:key\s+responsibilities|main\s+duties)[\s\S]*?(?=\n\s*\n|\n\s*[A-Z][A-Z\s]+:)/i
    ];
    
    for (const pattern of responsibilityPatterns) {
        const match = text.match(pattern);
        if (match) {
            return cleanText(match[0]);
        }
    }
    
    return null;
};
