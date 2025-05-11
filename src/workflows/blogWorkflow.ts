import { Step, Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { researchAgent } from "../agents/researchAgent";
import { writerAgent } from "../agents/writerAgent";

// Define the research step
const researchStep = new Step({
  id: "researchStep",
  execute: async ({ context }) => {
    if (!context?.triggerData?.query) {
      throw new Error("Query not found in trigger data");
    }
    const result = await researchAgent.generate(
      `Research information for a blog post about: ${context.triggerData.query}`
    );
    console.log("Research result:", result.text);
    return {
      research: result.text,
    };
  },
});

// Define the writing step
const writingStep = new Step({
  id: "writingStep",
  execute: async ({ context }) => {
    const research = context?.getStepResult<{ research: string }>("researchStep")?.research;
    if (!research) {
      throw new Error("Research not found from previous step");
    }

    const result = await writerAgent.generate(
      `Write a blog post using this research: ${research}. Focus on the specific content available in the tool and acknowledge if you cannot find sufficient information to answer a question.
    Base your responses only on the content provided, not on general knowledge.`
    );
    console.log("Writing result:", result.text);
    return {
      blogPost: result.text,
      research: research,
    };
  },
});

// Create and configure the workflow
export const blogWorkflow = new Workflow({
  name: "blog-workflow",
  triggerSchema: z.object({
    query: z.string().describe("The topic to research and write about"),
  }),
});

// Run steps sequentially
blogWorkflow.step(researchStep).then(writingStep).commit(); 