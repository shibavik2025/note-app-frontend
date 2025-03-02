// app/api/sentimentApi/route.ts

import { NextResponse } from "next/server";
import { analyzeSentiment } from "@utils/huggingFaceApi";

export async function POST(req: Request) {
  try {
    const { content } = await req.json(); // Get the content from the request body

    // Analyze sentiment using the utility function
    const sentiment = await analyzeSentiment(content);
    console.log("sentiment", sentiment);

    // Return the sentiment in the response
    return NextResponse.json({ sentiment });
  } catch (error) {
    console.log("sentiment error", error);
    return NextResponse.json({ error: "Failed to analyze sentiment." }, { status: 500 });
  }
}
