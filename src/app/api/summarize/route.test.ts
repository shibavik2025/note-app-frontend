import { POST } from "../../api/summarize/route";
import { generateSummary } from "@utils/huggingFaceApi";
import { NextResponse } from "next/server";

jest.mock("@utils/huggingFaceApi", () => ({
  generateSummary: jest.fn(),
}));

describe("Summary API Route", () => {
  it("returns summary successfully", async () => {
    const mockSummary = "This is a generated summary.";
    (generateSummary as jest.Mock).mockResolvedValue(mockSummary);

    const request = new Request("http://localhost/api/summary", {
      method: "POST",
      body: JSON.stringify({ content: "This is a long text that needs to be summarized." }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(generateSummary).toHaveBeenCalledWith("This is a long text that needs to be summarized.");
    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({ summary: mockSummary });
  });

  it("handles errors and returns 500", async () => {
    (generateSummary as jest.Mock).mockRejectedValue(new Error("API Failure"));

    const request = new Request("http://localhost/api/summary", {
      method: "POST",
      body: JSON.stringify({ content: "This is another text." }),
    });

    const response = await POST(request);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({ error: "Failed to summarize the text." });
  });
});
