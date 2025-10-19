// import {  createOllamaClient } from "./core/ollamaClient.js";

// const OllamaClient = createOllamaClient("mistral");

// const runTest = async () => {
//   const prompt = "Write a 1-sentence description of CareerForge, an AI career assistant.";
//   const output = await OllamaClient.generate(prompt);
//   console.log("Mistral says:\n", output);
// };

// runTest();



import { extractResumeText, analyzeResume } from "./agents/resumeAgent.js";

const runTest = async () => {
  const resumePath = "./sample_resume.pdf";
  const jobDescription = `
We are looking for a Full Stack Developer skilled in JavaScript, Node.js, and React.
Experience with REST APIs and database design is a must.
`;

  console.log("📄 Extracting resume...");
  const resumeText = await extractResumeText(resumePath);

  console.log("🤖 Analyzing resume vs job description...");
  const analysis = await analyzeResume(resumeText, jobDescription);

  console.log("\n🧠 CareerForge Resume Review:\n");
  console.log(analysis);
};

runTest();

