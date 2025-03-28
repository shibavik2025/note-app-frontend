import { renderHook, act } from "@testing-library/react";
import { useNotes } from "./useNotes";

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, title: "Test Note", category: "Work", content: "Hello" },
      { id: 2, title: "Another Note", category: "Personal", content: "World" },
    ]),
  })
) as jest.Mock;

describe("useNotes Hook", () => {
  it("fetches and sets notes on mount", async () => {
    const { result } = renderHook(() => useNotes());

    expect(result.current.loading).toBe(true); // Initially loading

    // Wait for fetch to resolve
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.filteredNotes).toHaveLength(2);
  });

  it("filters notes based on search query", async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {});

    act(() => {
      result.current.handleSearch("test", "");
    });

    expect(result.current.filteredNotes).toHaveLength(1);
    expect(result.current.filteredNotes[0].title).toBe("Test Note");
  });

  it("filters notes by category", async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {});

    act(() => {
      result.current.handleSearch("", "Personal");
    });

    expect(result.current.filteredNotes).toHaveLength(1);
    expect(result.current.filteredNotes[0].category).toBe("Personal");
  });

  it("refreshes notes correctly", async () => {
    const { result } = renderHook(() => useNotes());

    await act(async () => {});

    act(() => {
      result.current.refreshNotes();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + refresh call
  });
});
