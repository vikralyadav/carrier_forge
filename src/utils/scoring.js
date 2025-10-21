/**
 * Scoring utilities for CareerForge
 * Provides various scoring algorithms for job matching, resume analysis, etc.
 */

/**
 * Calculate skill match score between resume and job description
 */
export const calculateSkillMatchScore = (resumeSkills, jobSkills) => {
    if (!resumeSkills || !jobSkills || resumeSkills.length === 0 || jobSkills.length === 0) {
        return 0;
    }
    
    const resumeSkillsLower = resumeSkills.map(skill => skill.toLowerCase().trim());
    const jobSkillsLower = jobSkills.map(skill => skill.toLowerCase().trim());
    
    let matchedSkills = 0;
    const matchedSkillNames = [];
    
    jobSkillsLower.forEach(jobSkill => {
        const isMatched = resumeSkillsLower.some(resumeSkill => {
            // Exact match
            if (resumeSkill === jobSkill) {
                return true;
            }
            
            // Partial match (contains)
            if (resumeSkill.includes(jobSkill) || jobSkill.includes(resumeSkill)) {
                return true;
            }
            
            // Fuzzy match for common variations
            const variations = getSkillVariations(jobSkill);
            return variations.some(variation => 
                resumeSkill.includes(variation) || variation.includes(resumeSkill)
            );
        });
        
        if (isMatched) {
            matchedSkills++;
            matchedSkillNames.push(jobSkill);
        }
    });
    
    const score = matchedSkills / jobSkillsLower.length;
    return {
        score: Math.round(score * 100) / 100,
        matchedSkills: matchedSkillNames,
        totalRequired: jobSkillsLower.length,
        matchedCount: matchedSkills
    };
};

/**
 * Get skill variations for fuzzy matching
 */
const getSkillVariations = (skill) => {
    const variations = [skill];
    
    // Common skill variations
    const skillMap = {
        'javascript': ['js', 'ecmascript'],
        'python': ['py'],
        'react': ['reactjs', 'react.js'],
        'node.js': ['nodejs', 'node'],
        'sql': ['mysql', 'postgresql', 'postgres'],
        'aws': ['amazon web services'],
        'docker': ['containerization'],
        'kubernetes': ['k8s'],
        'machine learning': ['ml', 'ai'],
        'artificial intelligence': ['ai', 'machine learning']
    };
    
    const lowerSkill = skill.toLowerCase();
    if (skillMap[lowerSkill]) {
        variations.push(...skillMap[lowerSkill]);
    }
    
    return variations;
};

/**
 * Calculate experience match score
 */
export const calculateExperienceScore = (resumeExperience, requiredExperience) => {
    if (!resumeExperience || !requiredExperience) {
        return 0;
    }
    
    const resumeYears = extractYearsFromText(resumeExperience);
    const requiredYears = extractYearsFromText(requiredExperience);
    
    if (resumeYears >= requiredYears) {
        return 1.0; // Perfect match
    } else if (resumeYears >= requiredYears * 0.8) {
        return 0.8; // Good match
    } else if (resumeYears >= requiredYears * 0.6) {
        return 0.6; // Acceptable match
    } else {
        return resumeYears / requiredYears; // Partial match
    }
};

/**
 * Extract years of experience from text
 */
const extractYearsFromText = (text) => {
    if (!text) return 0;
    
    // Look for patterns like "3+ years", "5 years", "2-4 years"
    const yearPatterns = [
        /(\d+)\+?\s*years?/gi,
        /(\d+)\s*-\s*(\d+)\s*years?/gi,
        /(\d+)\s*to\s*(\d+)\s*years?/gi
    ];
    
    let maxYears = 0;
    
    yearPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(match => {
                const numbers = match.match(/\d+/g);
                if (numbers) {
                    const years = numbers.map(Number);
                    const avgYears = years.reduce((sum, year) => sum + year, 0) / years.length;
                    maxYears = Math.max(maxYears, avgYears);
                }
            });
        }
    });
    
    return maxYears;
};

/**
 * Calculate overall job match score
 */
export const calculateOverallMatchScore = (resumeData, jobData) => {
    const skillScore = calculateSkillMatchScore(
        resumeData.skills || [],
        jobData.requiredSkills || []
    );
    
    const experienceScore = calculateExperienceScore(
        resumeData.experience,
        jobData.requiredExperience
    );
    
    const educationScore = calculateEducationScore(
        resumeData.education,
        jobData.requiredEducation
    );
    
    // Weighted average
    const weights = {
        skills: 0.5,
        experience: 0.3,
        education: 0.2
    };
    
    const overallScore = (
        skillScore.score * weights.skills +
        experienceScore * weights.experience +
        educationScore * weights.education
    );
    
    return {
        overall: Math.round(overallScore * 100) / 100,
        breakdown: {
            skills: skillScore,
            experience: experienceScore,
            education: educationScore
        },
        weights
    };
};

/**
 * Calculate education match score
 */
const calculateEducationScore = (resumeEducation, requiredEducation) => {
    if (!resumeEducation || !requiredEducation) {
        return 0.5; // Neutral score if not specified
    }
    
    const educationLevels = {
        'high school': 1,
        'associate': 2,
        'bachelor': 3,
        'master': 4,
        'phd': 5,
        'doctorate': 5
    };
    
    const resumeLevel = getEducationLevel(resumeEducation);
    const requiredLevel = getEducationLevel(requiredEducation);
    
    if (resumeLevel >= requiredLevel) {
        return 1.0;
    } else {
        return resumeLevel / requiredLevel;
    }
};

/**
 * Get education level from text
 */
const getEducationLevel = (educationText) => {
    const text = educationText.toLowerCase();
    
    if (text.includes('phd') || text.includes('doctorate')) return 5;
    if (text.includes('master')) return 4;
    if (text.includes('bachelor') || text.includes('bs') || text.includes('ba')) return 3;
    if (text.includes('associate') || text.includes('aa') || text.includes('as')) return 2;
    if (text.includes('high school') || text.includes('diploma')) return 1;
    
    return 3; // Default to bachelor's level
};

/**
 * Calculate keyword density score
 */
export const calculateKeywordDensityScore = (text, keywords) => {
    if (!text || !keywords || keywords.length === 0) {
        return 0;
    }
    
    const textLower = text.toLowerCase();
    let matchedKeywords = 0;
    const matchedKeywordList = [];
    
    keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        if (textLower.includes(keywordLower)) {
            matchedKeywords++;
            matchedKeywordList.push(keyword);
        }
    });
    
    return {
        score: matchedKeywords / keywords.length,
        matchedKeywords: matchedKeywordList,
        totalKeywords: keywords.length,
        matchedCount: matchedKeywords
    };
};

/**
 * Calculate ATS optimization score
 */
export const calculateATSScore = (resumeText) => {
    const atsFactors = {
        hasContactInfo: /(phone|email|address)/i.test(resumeText),
        hasSummary: /(summary|objective|profile)/i.test(resumeText),
        hasSkills: /(skills|technical skills|technologies)/i.test(resumeText),
        hasExperience: /(experience|employment|work history)/i.test(resumeText),
        hasEducation: /(education|degree|university|college)/i.test(resumeText),
        hasKeywords: /(achieved|developed|implemented|managed|led|created)/i.test(resumeText),
        properFormatting: !/(\t|\s{4,})/g.test(resumeText), // No excessive tabs or spaces
        hasQuantifiableResults: /\d+%|\$\d+|\d+\+|\d+\s*(years?|months?)/i.test(resumeText)
    };
    
    const score = Object.values(atsFactors).filter(Boolean).length / Object.keys(atsFactors).length;
    
    return {
        score: Math.round(score * 100) / 100,
        factors: atsFactors,
        recommendations: generateATSRecommendations(atsFactors)
    };
};

/**
 * Generate ATS optimization recommendations
 */
const generateATSRecommendations = (atsFactors) => {
    const recommendations = [];
    
    if (!atsFactors.hasContactInfo) {
        recommendations.push("Add clear contact information (phone, email, address)");
    }
    if (!atsFactors.hasSummary) {
        recommendations.push("Include a professional summary or objective");
    }
    if (!atsFactors.hasSkills) {
        recommendations.push("Add a dedicated skills section");
    }
    if (!atsFactors.hasExperience) {
        recommendations.push("Include detailed work experience");
    }
    if (!atsFactors.hasEducation) {
        recommendations.push("Add education section");
    }
    if (!atsFactors.hasKeywords) {
        recommendations.push("Use action verbs and keywords from job descriptions");
    }
    if (!atsFactors.properFormatting) {
        recommendations.push("Improve formatting - avoid excessive tabs and spaces");
    }
    if (!atsFactors.hasQuantifiableResults) {
        recommendations.push("Add quantifiable achievements and metrics");
    }
    
    return recommendations;
};
