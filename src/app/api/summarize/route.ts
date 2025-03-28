import { NextResponse } from "next/server";
import { generateSummary } from "@utils/huggingFaceApi";

export async function POST(req: Request) {
  try {
    const { content } = await req.json(); // Get the content from the request body

    // Generate summary using the utility function
    const summary = await generateSummary(content);

    // Return the summary in the response
    return NextResponse.json({ summary });
  } catch (error) {
    console.log("summarize error", error);
    return NextResponse.json({ error: "Failed to summarize the text." }, { status: 500 });
  }
}
