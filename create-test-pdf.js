#!/usr/bin/env node

/**
 * Create a simple text-based PDF for testing
 */

import fs from 'fs-extra';

// Create a simple text-based PDF content
const testResumeText = `
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 3+ years in full-stack development.
Skilled in JavaScript, React, Node.js, and Python.

TECHNICAL SKILLS
- Programming Languages: JavaScript, Python, Java
- Frontend: React, HTML5, CSS3
- Backend: Node.js, Express.js
- Databases: MongoDB, PostgreSQL

EXPERIENCE
Software Engineer | TechCorp Inc. | 2021 - Present
- Developed web applications using React and Node.js
- Built RESTful APIs and database systems
- Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018 - 2021
`;

// Create a simple HTML file that can be converted to PDF
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Resume</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        h2 { color: #666; margin-top: 20px; }
        p { margin: 5px 0; }
        ul { margin: 5px 0; }
    </style>
</head>
<body>
    <h1>John Doe</h1>
    <p>Software Engineer</p>
    <p>john.doe@email.com | (555) 123-4567</p>
    
    <h2>PROFESSIONAL SUMMARY</h2>
    <p>Experienced software engineer with 3+ years in full-stack development.
    Skilled in JavaScript, React, Node.js, and Python.</p>
    
    <h2>TECHNICAL SKILLS</h2>
    <ul>
        <li>Programming Languages: JavaScript, Python, Java</li>
        <li>Frontend: React, HTML5, CSS3</li>
        <li>Backend: Node.js, Express.js</li>
        <li>Databases: MongoDB, PostgreSQL</li>
    </ul>
    
    <h2>EXPERIENCE</h2>
    <p><strong>Software Engineer | TechCorp Inc. | 2021 - Present</strong></p>
    <ul>
        <li>Developed web applications using React and Node.js</li>
        <li>Built RESTful APIs and database systems</li>
        <li>Collaborated with cross-functional teams</li>
    </ul>
    
    <h2>EDUCATION</h2>
    <p><strong>Bachelor of Science in Computer Science</strong></p>
    <p>University of Technology | 2018 - 2021</p>
</body>
</html>
`;

async function createTestFiles() {
  try {
    console.log('📄 Creating test files...');
    
    // Create HTML file
    await fs.writeFile('./test-resume.html', htmlContent);
    console.log('✅ Created test-resume.html');
    
    // Create text file
    await fs.writeFile('./test-resume.txt', testResumeText);
    console.log('✅ Created test-resume.txt');
    
    console.log('\n📝 Instructions:');
    console.log('1. Open test-resume.html in a browser');
    console.log('2. Print to PDF and save as test-resume.pdf');
    console.log('3. Or use an online HTML to PDF converter');
    console.log('4. Then run: npm run test:pdf');
    
  } catch (error) {
    console.error('❌ Error creating test files:', error);
  }
}

createTestFiles();
