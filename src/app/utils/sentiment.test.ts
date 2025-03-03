import { decideSentiment } from "@utils/sentiment";


describe("decideSentiment", () => {
  it("returns the sentiment with the highest score", () => {
    const response = 
      [
        { label: "NEGATIVE", score: 0.2 },
        { label: "NEUTRAL", score: 0.5 },
        { label: "POSITIVE", score: 0.8 },
      ];
    ;

    const result = decideSentiment([response]);
    expect(result).toBe("POSITIVE");
  });

  it("handles a single sentiment response correctly", () => {
    const response = [{ label: "NEGATIVE", score: 0.9 }];

    const result = decideSentiment([response]);
    expect(result).toBe("NEGATIVE");
  });

  it("handles an already sorted response correctly", () => {
    const response = [
      
        { label: "POSITIVE", score: 0.95 },
        { label: "NEUTRAL", score: 0.7 },
        { label: "NEGATIVE", score: 0.3 },
    ];

    const result = decideSentiment([response]);
    expect(result).toBe("POSITIVE");
  });

  it("handles an empty response gracefully", () => {
    const response: [any[]] = [[]];

    expect(() => decideSentiment(response)).toThrowError(
      "Cannot read properties of undefined (reading 'label')"
    );
  });

  it("logs the sentiment data for debugging", () => {
    console.log = jest.fn();

    const response = [
      
        { label: "POSITIVE", score: 0.9 },
        { label: "NEGATIVE", score: 0.1 },
    ];

    decideSentiment([response]);
    expect(console.log).toHaveBeenCalledWith("sentiment data", response[0]);
  });
});
