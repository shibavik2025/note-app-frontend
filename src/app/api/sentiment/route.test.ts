import { POST } from "../../api/sentiment/route";
import { analyzeSentiment } from "@utils/huggingFaceApi";
import { NextResponse } from "next/server";

jest.mock("@utils/huggingFaceApi", () => ({
  analyzeSentiment: jest.fn(),
}));

describe("Sentiment API Route", () => {
    it("should return sentiment analysis result", async () => {
        // Mock request body
        const mockRequest = new Request("http://localhost/api/sentiment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: "This is a test" }),
        });
    
        // Execute the API route
        const response = await POST(mockRequest);
        const json = await response.json();
    
        // Check if the response contains expected fields
        expect(response.status).toBe(200);
        expect(json).toHaveProperty("sentiment");
    });

  it("handles errors and returns 500", async () => {
    (analyzeSentiment as jest.Mock).mockRejectedValue(new Error("API Failure"));

    const request = new Request("http://localhost/api/sentiment", {
      method: "POST",
      body: JSON.stringify({ content: "This is a bad day!" }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({ error: "Failed to analyze sentiment." });
  });
});
