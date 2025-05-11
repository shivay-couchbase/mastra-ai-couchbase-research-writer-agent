# Mastra Multi Agent Workflow / RAG Demo with Couchbase

This project demonstrates a multi-agent workflow using Mastra, combining research and writing capabilities with Couchbase as the vector store. The system processes academic papers, generates embeddings, and creates blog posts based on the research.

## Features

- 🤖 Multi-agent workflow with research and writing capabilities
- 🔍 Vector similarity search using Couchbase
- 📚 Processing of academic papers and documents
- ✍️ Automated blog post generation
- 🔄 Sequential workflow with data passing between agents

## Prerequisites

- Node.js (v18+ recommended)
- Couchbase Server (Version 7.6.4 or higher) with Search Service enabled
- OpenAI API key
- Nebius API key (for blog writing)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Couchbase Configuration
CB_CONNECTION_STRING=couchbases://your_cluster_host?ssl=no_verify
CB_USERNAME=your_couchbase_user
CB_PASSWORD=your_couchbase_password
CB_BUCKET=your_vector_bucket
CB_SCOPE=_default
CB_COLLECTION=vector_data

# API Keys
OPENAI_API_KEY=your_openai_api_key
NEBIUS_API_KEY=your_nebius_api_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mastra-rag-demo
```

2. Install dependencies:
```bash
npm install
```

## Project Structure

```
src/
├── agents/
│   ├── researchAgent.ts    # Agent for research and information gathering
│   └── writerAgent.ts      # Agent for blog post writing
├── workflows/
│   └── blogWorkflow.ts     # Multi-agent workflow definition
└── index.ts               # Main application entry point
```

## How It Works

1. **Document Processing**:
   - Loads academic papers (currently configured for the transformer paper)
   - Chunks the content into manageable pieces
   - Generates embeddings using OpenAI's text-embedding-3-small model

2. **Vector Storage**:
   - Stores embeddings and metadata in Couchbase
   - Creates a vector search index for similarity queries

3. **Multi-Agent Workflow**:
   - Research Agent: Gathers information based on user queries
   - Writer Agent: Creates blog posts using the research
   - Sequential execution with data passing between agents

## Usage

Run the development server:
```bash
npm run dev
```

The workflow will:
1. Process the transformer paper
2. Store embeddings in Couchbase
3. Execute the research and writing workflow
4. Output results to the console

## Customization

To modify the workflow:
1. Update the query in `src/index.ts`
2. Adjust agent instructions in `src/agents/`
3. Modify workflow steps in `src/workflows/blogWorkflow.ts`

## Dependencies

- `@mastra/core`: Core Mastra functionality
- `@mastra/couchbase`: Couchbase vector store integration
- `@mastra/rag`: RAG (Retrieval-Augmented Generation) capabilities
- `@ai-sdk/openai`: OpenAI integration
- `zod`: Schema validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
