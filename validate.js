#!/usr/bin/env node

/**
 * CareerForge Validation Script
 * 
 * This script validates the entire CareerForge codebase for issues
 * Run with: node validate.js
 */

import fs from 'fs-extra';
import path from 'path';
import { createLogger } from './src/core/logger.js';

const logger = createLogger('validator');

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

function addResult(type, message, file = null) {
  results[type]++;
  results.issues.push({ type, message, file });
  
  const icon = type === 'passed' ? '✅' : type === 'failed' ? '❌' : '⚠️';
  console.log(`${icon} ${message}${file ? ` (${file})` : ''}`);
}

// Check if file exists
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    addResult('passed', `${description} exists`);
    return true;
  } else {
    addResult('failed', `${description} missing`);
    return false;
  }
}

// Check if file has content
function checkFileContent(filePath, description) {
  if (!fs.existsSync(filePath)) {
    addResult('failed', `${description} file missing`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.trim().length === 0) {
    addResult('failed', `${description} file is empty`);
    return false;
  }
  
  addResult('passed', `${description} has content`);
  return true;
}

// Check for syntax errors in JavaScript files
function checkJavaScriptSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    if (content.includes('import') && !content.includes('export')) {
      addResult('warning', 'File has imports but no exports', filePath);
    }
    
    if (content.includes('export') && !content.includes('import')) {
      addResult('warning', 'File has exports but no imports', filePath);
    }
    
    // Check for common syntax issues
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      addResult('failed', 'Mismatched braces', filePath);
      return false;
    }
    
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      addResult('failed', 'Mismatched parentheses', filePath);
      return false;
    }
    
    addResult('passed', 'JavaScript syntax looks good', filePath);
    return true;
  } catch (error) {
    addResult('failed', `JavaScript syntax error: ${error.message}`, filePath);
    return false;
  }
}

// Check package.json
function checkPackageJson() {
  const packagePath = './package.json';
  if (!checkFileExists(packagePath, 'package.json')) {
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check required fields
    const requiredFields = ['name', 'version', 'scripts', 'dependencies'];
    requiredFields.forEach(field => {
      if (packageJson[field]) {
        addResult('passed', `package.json has ${field}`);
      } else {
        addResult('failed', `package.json missing ${field}`);
      }
    });
    
    // Check scripts
    const requiredScripts = ['start', 'setup', 'demo', 'test'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        addResult('passed', `package.json has ${script} script`);
      } else {
        addResult('failed', `package.json missing ${script} script`);
      }
    });
    
    // Check dependencies
    const requiredDeps = ['express', 'cors', 'dotenv', 'axios', 'ollama', 'pdf-parse'];
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        addResult('passed', `package.json has ${dep} dependency`);
      } else {
        addResult('failed', `package.json missing ${dep} dependency`);
      }
    });
    
    return true;
  } catch (error) {
    addResult('failed', `package.json parse error: ${error.message}`);
    return false;
  }
}

// Check directory structure
function checkDirectoryStructure() {
  const requiredDirs = [
    'src',
    'src/agents',
    'src/core',
    'src/routes',
    'src/utils',
    'src/middleware',
    'public',
    'examples',
    'logs'
  ];
  
  requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      addResult('passed', `Directory ${dir} exists`);
    } else {
      addResult('failed', `Directory ${dir} missing`);
    }
  });
}

// Check core files
function checkCoreFiles() {
  const coreFiles = [
    { path: 'src/core/ollamaClient.js', desc: 'Ollama client' },
    { path: 'src/core/logger.js', desc: 'Logger' },
    { path: 'src/core/vectorStore.js', desc: 'Vector store' }
  ];
  
  coreFiles.forEach(file => {
    if (checkFileContent(file.path, file.desc)) {
      checkJavaScriptSyntax(file.path);
    }
  });
}

// Check agent files
function checkAgentFiles() {
  const agentFiles = [
    'src/agents/resumeAgent.js',
    'src/agents/jobMatcherAgent.js',
    'src/agents/interviewAgent.js',
    'src/agents/interviewCoachAgent.js',
    'src/agents/codereviewerAgent.js',
    'src/agents/portfolioAgent.js',
    'src/agents/schedulerAgent.js',
    'src/agents/careerForgeOrchestrator.js'
  ];
  
  agentFiles.forEach(file => {
    if (checkFileContent(file, `Agent ${path.basename(file)}`)) {
      checkJavaScriptSyntax(file);
    }
  });
}

// Check route files
function checkRouteFiles() {
  const routeFiles = [
    'src/routes/resume.js',
    'src/routes/jobMatcher.js',
    'src/routes/interview.js',
    'src/routes/portfolio.js',
    'src/routes/codeReview.js',
    'src/routes/scheduler.js'
  ];
  
  routeFiles.forEach(file => {
    if (checkFileContent(file, `Route ${path.basename(file)}`)) {
      checkJavaScriptSyntax(file);
    }
  });
}

// Check utility files
function checkUtilityFiles() {
  const utilityFiles = [
    'src/utils/embeddings.js',
    'src/utils/scoring.js',
    'src/utils/textExtract.js'
  ];
  
  utilityFiles.forEach(file => {
    if (checkFileContent(file, `Utility ${path.basename(file)}`)) {
      checkJavaScriptSyntax(file);
    }
  });
}

// Check main files
function checkMainFiles() {
  const mainFiles = [
    { path: 'server.js', desc: 'Main server file' },
    { path: 'setup.js', desc: 'Setup script' },
    { path: 'test-api.js', desc: 'API test script' },
    { path: 'examples/demo.js', desc: 'Demo script' },
    { path: 'public/index.html', desc: 'Frontend dashboard' },
    { path: 'README.md', desc: 'Documentation' }
  ];
  
  mainFiles.forEach(file => {
    if (checkFileContent(file.path, file.desc)) {
      if (file.path.endsWith('.js')) {
        checkJavaScriptSyntax(file.path);
      }
    }
  });
}

// Check for common issues
function checkCommonIssues() {
  // Check for TODO comments
  const files = [
    'server.js',
    'src/agents',
    'src/routes',
    'src/core'
  ];
  
  files.forEach(fileOrDir => {
    if (fs.existsSync(fileOrDir)) {
      const stats = fs.statSync(fileOrDir);
      if (stats.isDirectory()) {
        // Check all JS files in directory
        const jsFiles = fs.readdirSync(fileOrDir)
          .filter(file => file.endsWith('.js'))
          .map(file => path.join(fileOrDir, file));
        
        jsFiles.forEach(file => {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('TODO') || content.includes('FIXME')) {
            addResult('warning', 'File contains TODO/FIXME comments', file);
          }
        });
      } else {
        const content = fs.readFileSync(fileOrDir, 'utf8');
        if (content.includes('TODO') || content.includes('FIXME')) {
          addResult('warning', 'File contains TODO/FIXME comments', fileOrDir);
        }
      }
    }
  });
}

// Main validation function
async function validateCareerForge() {
  console.log('🔍 Starting CareerForge validation...\n');
  
  try {
    // Check package.json
    console.log('📦 Checking package.json...');
    checkPackageJson();
    
    // Check directory structure
    console.log('\n📁 Checking directory structure...');
    checkDirectoryStructure();
    
    // Check core files
    console.log('\n🔧 Checking core files...');
    checkCoreFiles();
    
    // Check agent files
    console.log('\n🤖 Checking agent files...');
    checkAgentFiles();
    
    // Check route files
    console.log('\n🛣️  Checking route files...');
    checkRouteFiles();
    
    // Check utility files
    console.log('\n🛠️  Checking utility files...');
    checkUtilityFiles();
    
    // Check main files
    console.log('\n📄 Checking main files...');
    checkMainFiles();
    
    // Check for common issues
    console.log('\n⚠️  Checking for common issues...');
    checkCommonIssues();
    
    // Print summary
    console.log('\n📊 Validation Summary:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️  Warnings: ${results.warnings}`);
    
    if (results.failed === 0) {
      console.log('\n🎉 All validations passed! CareerForge is ready to use.');
      return true;
    } else {
      console.log('\n⚠️  Some validations failed. Please fix the issues above.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Validation error:', error);
    return false;
  }
}

// Run validation
validateCareerForge().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
