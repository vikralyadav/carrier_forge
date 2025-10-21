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


  .addNode("analyze_resume", async (state) => {
    console.log(" Analyzing Resume...");
    const analysis = await analyzeResume(state.resume, state.jobDescriptions[0]);
    return { ...state, analysis };
  })

  .addNode("match_jobs", async (state) => {
    console.log("Matching Jobs...");
    const matches = await matchJob(state.resume, state.jobDescriptions);
    return { ...state, matches };
  })


  .addEdge("__start__", "analyze_resume")  
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
