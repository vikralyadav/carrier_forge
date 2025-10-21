#!/usr/bin/env node

/**
 * CareerForge Setup Script
 * 
 * This script helps set up the CareerForge environment
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

const logger = createLogger('setup');

function createLogger(service) {
  return {
    info: (msg) => console.log(`[${service}] ${msg}`),
    error: (msg) => console.error(`[${service}] ERROR: ${msg}`),
    success: (msg) => console.log(`[${service}] ✅ ${msg}`)
  };
}

async function setupCareerForge() {
  console.log('🚀 Setting up CareerForge...\n');

  try {
    // 1. Create necessary directories
    logger.info('Creating directories...');
    await fs.ensureDir('./logs');
    await fs.ensureDir('./data/vectors');
    await fs.ensureDir('./public');
    logger.success('Directories created');

    // 2. Create environment file if it doesn't exist
    const envPath = './.env';
    if (!fs.existsSync(envPath)) {
      logger.info('Creating .env file...');
      const envContent = `# CareerForge Configuration

# Server Configuration
PORT=3000
NODE_ENV=development

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=./logs

# Vector Store Configuration
VECTOR_STORE_TYPE=local
VECTOR_STORE_PATH=./data/vectors

# API Configuration
API_RATE_LIMIT=100
API_TIMEOUT=30000

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,txt,doc,docx

# Security Configuration
CORS_ORIGIN=http://localhost:3000
API_KEY_REQUIRED=false
`;
      await fs.writeFile(envPath, envContent);
      logger.success('.env file created');
    } else {
      logger.info('.env file already exists');
    }

    // 3. Check if Ollama is installed
    logger.info('Checking Ollama installation...');
    try {
      execSync('ollama --version', { stdio: 'pipe' });
      logger.success('Ollama is installed');
    } catch (error) {
      logger.error('Ollama is not installed. Please install it from https://ollama.ai/');
      console.log('\n📋 Installation instructions:');
      console.log('1. Visit https://ollama.ai/');
      console.log('2. Download and install Ollama for your platform');
      console.log('3. Run: ollama pull mistral');
      console.log('4. Run: ollama serve');
      return;
    }

    // 4. Check if Mistral model is available
    logger.info('Checking Mistral model...');
    try {
      execSync('ollama list | grep mistral', { stdio: 'pipe' });
      logger.success('Mistral model is available');
    } catch (error) {
      logger.info('Pulling Mistral model...');
      try {
        execSync('ollama pull mistral', { stdio: 'inherit' });
        logger.success('Mistral model pulled successfully');
      } catch (pullError) {
        logger.error('Failed to pull Mistral model. Please run: ollama pull mistral');
        return;
      }
    }

    // 5. Check if Ollama server is running
    logger.info('Checking Ollama server...');
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      if (response.ok) {
        logger.success('Ollama server is running');
      } else {
        throw new Error('Server not responding');
      }
    } catch (error) {
      logger.error('Ollama server is not running. Please start it with: ollama serve');
      console.log('\n🔧 To start Ollama server:');
      console.log('1. Open a new terminal');
      console.log('2. Run: ollama serve');
      console.log('3. Keep it running in the background');
      return;
    }

    // 6. Test the setup
    logger.info('Testing setup...');
    try {
      const { createOllamaClient } = await import('./src/core/ollamaClient.js');
      const ollama = createOllamaClient();
      const testResponse = await ollama.generate('Hello, this is a test. Respond with "OK" if you can read this.');
      if (testResponse && testResponse.includes('OK')) {
        logger.success('Ollama connection test passed');
      } else {
        logger.error('Ollama connection test failed');
        return;
      }
    } catch (error) {
      logger.error('Setup test failed:', error.message);
      return;
    }

    console.log('\n🎉 CareerForge setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Open your browser to: http://localhost:3000');
    console.log('3. Run the demo: npm run demo');
    console.log('\n🔗 Useful commands:');
    console.log('- npm start          # Start the server');
    console.log('- npm run dev        # Start with auto-reload');
    console.log('- npm run demo       # Run the demo script');
    console.log('- ollama serve       # Start Ollama server');
    console.log('- ollama list        # List available models');

  } catch (error) {
    logger.error('Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Node.js is installed (v16+)');
    console.log('2. Run: npm install');
    console.log('3. Install Ollama from https://ollama.ai/');
    console.log('4. Run: ollama pull mistral');
    console.log('5. Run: ollama serve');
  }
}

// Run setup
setupCareerForge();
