// app/api/categorizeApi/route.ts

import { NextResponse } from "next/server";
import { categorizeText } from "@utils/huggingFaceApi";
export async function POST(req: Request) {
  try {
    const { content } = await req.json(); // Get the content from the request body

    // Categorize the text using the utility function
    const category = await categorizeText(content);

    // Return the category in the response
    return NextResponse.json({category });
  } catch (error) {
    console.log("category", error);
    return NextResponse.json({ error: "Failed to categorize the text." }, { status: 500 });
  }
}
