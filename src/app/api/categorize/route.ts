import { NextResponse } from "next/server";
import { categorizeText } from "@utils/huggingFaceApi";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    // Validate request body
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content provided." }, { status: 400 });
    }

    // Categorize the text
    const category = await categorizeText(content);

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error in categorize API:", error);
    return NextResponse.json({ error: "Failed to categorize the text." }, { status: 500 });
  }
}
