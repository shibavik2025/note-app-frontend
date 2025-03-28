import {
    analyzeSentiment,
    categorizeText,
    generateSummary,
    getEntitiesFromText,
    extractRelationships,
    buildKnowledgeGraph,
  } from "@utils/huggingFaceApi";
  import { decideSentiment } from "@utils/sentiment";
  
  // Mock API response function
  jest.mock("@utils/sentiment", () => ({
    decideSentiment: jest.fn(),
  }));
  
  // Mock fetch API
  global.fetch = jest.fn();
  
  describe("Hugging Face API Utilities", () => {
    const mockResponse = (data: any) =>
      Promise.resolve({
        json: () => Promise.resolve(data),
      });
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("analyzes sentiment successfully", async () => {
      (fetch as jest.Mock).mockImplementation(() =>
        mockResponse([{ label: "POSITIVE", score: 0.98 }])
      );
  
      (decideSentiment as jest.Mock).mockReturnValue("POSITIVE");
  
      const result = await analyzeSentiment("This is a great product!");
      
      expect(fetch).toHaveBeenCalled();
      expect(decideSentiment).toHaveBeenCalled();
      expect(result).toBe("POSITIVE");
    });
  
    it("categorizes text successfully", async () => {
      (fetch as jest.Mock).mockImplementation(() =>
        mockResponse([[{ label: "Finance", score: 0.95 }]])
      );
  
      const result = await categorizeText("This is a financial report.");
      
      expect(fetch).toHaveBeenCalled();
      expect(result).toBe("Finance");
    });
  
    it("returns 'Uncategorized' if categorization API fails", async () => {
      (fetch as jest.Mock).mockImplementation(() => mockResponse([]));
  
      const result = await categorizeText("Random text.");
      
      expect(result).toBe("Uncategorized");
    });
  
    it("generates a summary successfully", async () => {
      (fetch as jest.Mock).mockImplementation(() =>
        mockResponse([{ summary_text: "This is a summarized text." }])
      );
  
      const result = await generateSummary("This is a long document that needs summarization.");
      
      expect(fetch).toHaveBeenCalled();
      expect(result).toBe("This is a summarized text.");
    });
  
    it("returns 'No summary available' if summarization API fails", async () => {
      (fetch as jest.Mock).mockImplementation(() => mockResponse([]));
  
      const result = await generateSummary("Random text.");
      
      expect(result).toBe("No summary available");
    });
  
    it("extracts entities from text successfully", async () => {
      (fetch as jest.Mock).mockImplementation(() =>
        mockResponse([{ word: "New York", entity: "Location" }])
      );
  
      const result = await getEntitiesFromText("I live in New York.");
      
      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual([{ id: "New York", label: "Location" }]);
    });
  
    it("extracts relationships from text successfully", async () => {
      (fetch as jest.Mock).mockImplementation(() =>
        mockResponse([{ subject: "Google", object: "Sundar Pichai", relation: "CEO_of" }])
      );
  
      const result = await extractRelationships("Google is led by Sundar Pichai.");
      
      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual([
        { source: "Google", target: "Sundar Pichai", relationship: "CEO_of" },
      ]);
    });
  
  
    it("handles API errors and throws an exception", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("API error"));
  
      await expect(analyzeSentiment("This is a test.")).rejects.toThrow(
        "Failed to communicate with Hugging Face API"
      );
    });
  });
  