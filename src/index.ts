import { MDocument } from "@mastra/rag";
import { Mastra } from "@mastra/core";
import { CouchbaseVector } from "@mastra/couchbase";
import { embedMany } from "ai";
import { LibSQLStore } from "@mastra/libsql";
import { blogWorkflow } from "./workflows/blogWorkflow";

import { researchAgent } from "./agents/researchAgent";
import { writerAgent } from "./agents/writerAgent";
import { openai } from "@ai-sdk/openai";

// Initialize Couchbase vector store
const couchbaseVector = new CouchbaseVector(
  process.env.CB_CONNECTION_STRING!,
  process.env.CB_USERNAME!,
  process.env.CB_PASSWORD!,
  process.env.CB_BUCKET!,
  process.env.CB_SCOPE || '_default',
  process.env.CB_COLLECTION || 'vector_data'
);

export const mastra = new Mastra({
  agents: { researchAgent, writerAgent },
  vectors: { couchbaseVector },
  storage: new LibSQLStore({
    url: 'file:../mastra.db',
  }),
});

// Load the paper
const paperUrl = "https://arxiv.org/html/1706.03762";
const response = await fetch(paperUrl);
const paperText = await response.text();

// Create document and chunk it
const doc = MDocument.fromText(paperText);
const chunks = await doc.chunk({
  strategy: "recursive",
  size: 512,
  overlap: 50,
  separator: "\n",
});

// Generate embeddings
const { embeddings } = await embedMany({
  model: openai.embedding("text-embedding-3-small"),
  values: chunks.map((chunk) => chunk.text),
});

// Get the vector store instance from Mastra
const vectorStore = mastra.getVector("couchbaseVector");

// Create an index for our paper chunks
await vectorStore.createIndex({
  indexName: "papers",
  dimension: 1536,
  metric: "euclidean"
});

// Store embeddings
await vectorStore.upsert({
  indexName: "papers",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({
    text: chunk.text,
    source: "transformer-paper",
  })),
});

// Create a run instance of the workflow
const { runId, start } = blogWorkflow.createRun();

// Execute the workflow with a query
const res = await start({
  triggerData: { 
    query: "What was the gpu used? " 
  }
});
console.log("Workflow Results:", res.results);
