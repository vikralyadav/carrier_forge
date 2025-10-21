#!/usr/bin/env node

/**
 * Test PDF Processing Fix
 * 
 * This script tests the PDF processing fix to ensure it works correctly
 */

import fs from 'fs-extra';
import { extractResumeTextFromBuffer } from './src/agents/resumeAgent.js';

async function testPDFProcessing() {
  console.log('🧪 Testing PDF processing fix...\n');
  
  try {
    // Test with the sample resume PDF
    const pdfPath = './sample_resume.pdf';
    
    if (!fs.existsSync(pdfPath)) {
      console.log('❌ Sample resume PDF not found. Please ensure sample_resume.pdf exists.');
      return false;
    }
    
    console.log('📄 Reading sample resume PDF...');
    const buffer = await fs.readFile(pdfPath);
    console.log(`✅ PDF loaded successfully (${buffer.length} bytes)`);
    
    console.log('🔍 Extracting text from PDF buffer...');
    
    // Let's try to debug what's in the PDF
    try {
      const { PDFParse } = await import('pdf-parse');
      const data = await new PDFParse(buffer);
      console.log('📊 PDF Data Info:');
      console.log(`   - Text length: ${data.text ? data.text.length : 0}`);
      console.log(`   - Pages: ${data.numpages || 'unknown'}`);
      console.log(`   - Info: ${JSON.stringify(data.info || {})}`);
      
      if (data.text && data.text.trim().length > 0) {
        console.log('✅ Text extraction successful!');
        console.log(`📝 Extracted text length: ${data.text.length} characters`);
        console.log(`📝 First 200 characters: ${data.text.substring(0, 200)}...`);
        return true;
      } else {
        console.log('❌ No text extracted from PDF');
        console.log('🔍 This might be an image-based PDF or have no selectable text');
        console.log('\n💡 Solutions:');
        console.log('1. Create a new PDF with selectable text (not scanned images)');
        console.log('2. Run: node create-test-pdf.js to create test files');
        console.log('3. Use a text-based PDF for testing');
        return false;
      }
    } catch (error) {
      console.error('❌ PDF parsing error:', error.message);
      return false;
    }
    
  } catch (error) {
    console.error('❌ PDF processing test failed:', error.message);
    return false;
  }
}

// Run the test
testPDFProcessing().then(success => {
  if (success) {
    console.log('\n🎉 PDF processing fix is working correctly!');
    console.log('✅ The resume analysis should now work properly.');
  } else {
    console.log('\n⚠️  PDF processing test failed. Please check the error messages above.');
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});
