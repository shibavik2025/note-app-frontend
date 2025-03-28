import { POST } from "./route";

// Mock the categorizeText function
jest.mock("@utils/huggingFaceApi", () => ({
  categorizeText: jest.fn(() => Promise.resolve("Work")), // Mocked category response
}));

describe("POST /api/categorize", () => {
  it("returns a category when given valid input", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ content: "This is a test note" }),
    } as unknown as Request; // Mock Request object

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result).toEqual({ category: "Work" });
    expect(response.status).toBe(200);
  });

  it("returns an error for invalid input", async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error("Invalid request")),
    } as unknown as Request;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(result).toEqual({ error: "Failed to categorize the text." });
    expect(response.status).toBe(500);
  });
});
