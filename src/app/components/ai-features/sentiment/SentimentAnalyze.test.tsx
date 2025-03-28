import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SentimentAnalyze from "./SentimentAnalyze";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ sentiment: "POSITIVE" }),
  })
) as jest.Mock;

describe("SentimentAnalyze Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without sentiment initially", () => {
    render(<SentimentAnalyze content="" />);
    expect(screen.queryByText(/AI Sentiment Result:/i)).not.toBeInTheDocument();
  });

  test("calls API when content changes", async () => {
    render(<SentimentAnalyze content="This is a great day!" />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/sentiment", expect.any(Object))
    );
  });

  test("displays loading text when analyzing sentiment", async () => {
    render(<SentimentAnalyze content="Feeling happy today!" />);
    
    expect(await screen.findByText(/Sentiment Analysis/i)).toBeInTheDocument();
  });

  test("displays sentiment result when API returns response", async () => {
    render(<SentimentAnalyze content="I love this!" />);

    await waitFor(() => screen.getByText(/AI Sentiment Result:/i));

    expect(screen.getByText(/The sentiment of your note is: POSITIVE/i)).toBeInTheDocument();
    expect(screen.getByText(/😊/)).toBeInTheDocument(); // Emoji check
  });
});
