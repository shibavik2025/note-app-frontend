import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Summarizing from "./Summarizing";

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ summary: "This is a mock summary." }),
  })
) as jest.Mock;

describe("Summarizing Component", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  test("renders without crashing", () => {
    render(<Summarizing content="" />);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  test("displays loading text while summarizing", async () => {
    render(<Summarizing content="Test content" />);
    
    expect(screen.getByText("Summarizing...")).toBeInTheDocument();
  });

  test("fetches and displays summary", async () => {
    render(<Summarizing content="Test content" />);

    // Wait for the summary text to appear
    await waitFor(() => {
      expect(screen.getByText("🔍 AI Summary")).toBeInTheDocument();
      expect(screen.getByText("This is a mock summary.")).toBeInTheDocument();
    });

    // Ensure fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/summarize", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "Test content" }),
    }));
  });
});
