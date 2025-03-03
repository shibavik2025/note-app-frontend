import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "@components/search/SearchBar";

describe("SearchBar Component", () => {
  const mockOnSearch = jest.fn();
  const categoryColors = {
    Work: "blue",
    Personal: "green",
    Important: "red",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    render(<SearchBar onSearch={mockOnSearch} />);
  });

  test("renders search input and category dropdown", () => {
    expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  test("updates search input state and calls onSearch", () => {
    const searchInput = screen.getByPlaceholderText("Search notes...") as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: "meeting" } });

    expect(searchInput.value).toBe("meeting");
    expect(mockOnSearch).toHaveBeenCalledWith("meeting", "");
  });

  test("updates category state and calls onSearch", () => {
    const categorySelect = screen.getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(categorySelect, { target: { value: "Work" } });

    expect(categorySelect.value).toBe("Work");
    expect(mockOnSearch).toHaveBeenCalledWith("", "Work");
  });

  test("calls onSearch with updated query and category", () => {
    const searchInput = screen.getByPlaceholderText("Search notes...") as HTMLInputElement;
    const categorySelect = screen.getByRole("combobox") as HTMLSelectElement;

    fireEvent.change(searchInput, { target: { value: "meeting" } });
    fireEvent.change(categorySelect, { target: { value: "Work" } });

    expect(mockOnSearch).toHaveBeenCalledWith("meeting", "Work");
  });
});
