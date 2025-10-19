// import {  createOllamaClient } from "./core/ollamaClient.js";

// const OllamaClient = createOllamaClient("mistral");

// const runTest = async () => {
//   const prompt = "Write a 1-sentence description of CareerForge, an AI career assistant.";
//   const output = await OllamaClient.generate(prompt);
//   console.log("Mistral says:\n", output);
// };

// runTest();



// import { extractResumeText, analyzeResume } from "./agents/resumeAgent.js";

// const runTest = async () => {
//   const resumePath = "./sample_resume.pdf";
//   const jobDescription = `
// We are looking for a Full Stack Developer skilled in JavaScript, Node.js, and React.
// Experience with REST APIs and database design is a must.
// `;

//   console.log("📄 Extracting resume...");
//   const resumeText = await extractResumeText(resumePath);

//   console.log("🤖 Analyzing resume vs job description...");
//   const analysis = await analyzeResume(resumeText, jobDescription);

//   console.log("\n🧠 CareerForge Resume Review:\n");
//   console.log(analysis);
// };

// runTest();



// import { extractResumeText } from "./agents/resumeAgent.js";
// import { matchJobsList } from "./agents/jobMatcherAgent.js";

// const runTest = async () => {
//   const resumePath = "./sample_resume.pdf";
//   const jobs = [
//     {
//       title: "Full Stack Developer",
//       description: "We need a developer skilled in JavaScript, Node.js, React, REST APIs, and database design."
//     },
//     {
//       title: "Mobile App Developer",
//       description: "Experience with Flutter, Dart, Firebase, BLoC, and mobile UI design."
//     },
//     {
//       title: "Data Analyst",
//       description: "Skills required: SQL, Python, Excel, Data Visualization, Business Intelligence."
//     }
//   ];

//   const resumeText = await extractResumeText(resumePath);

//   console.log("🔍 Matching jobs...");
//   const results = await matchJobsList(resumeText, jobs);

//   console.log("\n🏆 Top Job Matches:");
//   results.forEach((r, i) => {
//     console.log(`${i + 1}. ${r.job_title} — Score: ${r.match.score}`);
//     console.log("   Matched Skills:", r.match.matched_skills.join(", "));
//   });
// };

// runTest();






import { extractResumeText } from "./agents/resumeAgent.js";
import { runCareerForgeWorkflow } from "./agents/careerForgeOrchestrator.js";

const runTest = async () => {
  const resumePath = "./sample_resume.pdf";
  const jobs = [
    { title: "Full Stack Developer", description: "JavaScript, Node.js, React, REST APIs" },
    { title: "Mobile App Developer", description: "Flutter, Dart, Firebase, BLoC" },
    { title: "Data Analyst", description: "SQL, Python, Excel, Data Visualization" }
  ];

  const resumeText = await extractResumeText(resumePath);

  console.log("🚀 Running full CareerForge workflow...");
  const results = await runCareerForgeWorkflow(resumeText, jobs);

  console.log("\n✅ CareerForge Results:");
  console.log(JSON.stringify(results, null, 2));
};

runTest();
