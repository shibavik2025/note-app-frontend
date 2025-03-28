import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Categorizing from "./Categorizing";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ category: "Technology" }),
  })
) as jest.Mock;

describe("Categorizing Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without category initially", () => {
    render(<Categorizing content="" />);
    expect(screen.queryByText(/AI Category/i)).not.toBeInTheDocument();
  });

  test("calls API when content changes", async () => {
    render(<Categorizing content="This is an article about AI." />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/categorize", expect.any(Object))
    );
  });

  test("shows 'Categorizing...' while waiting for API response", async () => {
    render(<Categorizing content="Discussing the future of blockchain." />);
    
    expect(await screen.findByText(/Categorizing.../i)).toBeInTheDocument();
  });

  test("displays category when API returns response", async () => {
    render(<Categorizing content="This is a science topic." />);

    await waitFor(() => screen.getByText(/AI Category/i));

    expect(screen.getByText(/Technology/i)).toBeInTheDocument();
  });
});
