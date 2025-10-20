import { StateGraph } from "@langchain/langgraph";
import { analyzeResume } from "../agents/resumeAgent.js";
import { matchJob } from "../agents/jobMatcherAgent.js";

const graph = new StateGraph({
  channels: {
    resume: null,
    jobDescriptions: [],
    analysis: null,
    matches: [],
  },
})

  // first node
  .addNode("analyze_resume", async (state) => {
    console.log("🔍 Analyzing Resume...");
    const analysis = await analyzeResume(state.resume, state.jobDescriptions[0]); // use 1 JD for context
    return { ...state, analysis };
  })

  // second node
  .addNode("match_jobs", async (state) => {
    console.log("🤝 Matching Jobs...");
    const matches = await matchJob(state.resume, state.jobDescriptions);
    return { ...state, matches };
  })

  // define graph flow
  .addEdge("__start__", "analyze_resume")   // ✅ start from here
  .addEdge("analyze_resume", "match_jobs")
  .addEdge("match_jobs", "__end__")
  .compile();

export async function runCareerGraph(resume, jobDescriptions) {
  const finalState = await graph.invoke({
    resume,
    jobDescriptions,
  });

  return {
    analysis: finalState.analysis,
    matches: finalState.matches,
  };
}
