import {  createOllamaClient } from "./core/ollamaClient.js";

const OllamaClient = createOllamaClient("mistral");

const runTest = async () => {
  const prompt = "Write a 1-sentence description of CareerForge, an AI career assistant.";
  const output = await OllamaClient.generate(prompt);
  console.log("Mistral says:\n", output);
};

runTest();
