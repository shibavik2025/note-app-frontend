// /app/api/knowledgeGraph/route.ts

import { NextResponse } from "next/server";
import { buildKnowledgeGraph } from "@utils/huggingFaceApi";

export async function POST(req: Request) {
  try {
    const { content } = await req.json(); // Get the content from the request body

    // Build the knowledge graph using Hugging Face API calls
    const graph = await buildKnowledgeGraph(content); 

    return NextResponse.json(graph); // Return the graph as a response
  } catch (error) {
    console.log("knowledge graph error", error);
    return NextResponse.json({ error: "Failed to build knowledge graph." }, { status: 500 });
  }
}
