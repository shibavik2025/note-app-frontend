import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "../src/app/page";
import { useNotes } from "@hooks/useNotes";
import { Note } from "@/app/types/note";

// Mock useNotes hook
jest.mock("@hooks/useNotes", () => ({
  useNotes: jest.fn(),
}));

describe("HomePage", () => {
  const mockNotes: Note[] = [
    { id: 1, title: "Test Note 1", category: "Work", content: "Content 1", created_at: "2024-03-01" },
    { id: 2, title: "Test Note 2", category: "Personal", content: "Content 2", created_at: "2024-03-02" },
  ];

  const mockHandleSearch = jest.fn();
  const mockRefreshNotes = jest.fn();

  beforeEach(() => {
    (useNotes as jest.Mock).mockReturnValue({
      filteredNotes: mockNotes,
      loading: false,
      refreshNotes: mockRefreshNotes,
      handleSearch: mockHandleSearch,
    });
  });

  it("renders HomePage correctly", () => {
    render(<HomePage />);

    expect(screen.getByText("📝 Your Notes")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument();
    expect(screen.getByText("Test Note 1")).toBeInTheDocument();
    expect(screen.getByText("Test Note 2")).toBeInTheDocument();
  });

  it("calls handleSearch when search input changes", () => {
    render(<HomePage />);
    const searchInput = screen.getByPlaceholderText("Search notes...");

    fireEvent.change(searchInput, { target: { value: "Test" } });

    expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    expect(mockHandleSearch).toHaveBeenCalledWith("Test", "");
  });

  it("opens NoteEditor when clicking Add Note", () => {
    render(<HomePage />);
    const addButton = screen.getByText("Add Note");

    fireEvent.click(addButton);

    expect(screen.getByText("Note Editor")).toBeInTheDocument();
  });

  it("passes notes to NotesTable", () => {
    render(<HomePage />);
    
    expect(screen.getByText("Test Note 1")).toBeInTheDocument();
    expect(screen.getByText("Test Note 2")).toBeInTheDocument();
  });

  it("opens NoteEditor when selecting a note", () => {
    render(<HomePage />);
    const noteRow = screen.getByText("Test Note 1");

    fireEvent.click(noteRow);

    expect(screen.getByText("Note Editor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Note 1")).toBeInTheDocument();
  });

  it("closes NoteEditor and refreshes notes", () => {
    render(<HomePage />);
    fireEvent.click(screen.getByText("Add Note")); // Open editor

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton); // Close editor

    expect(mockRefreshNotes).toHaveBeenCalledTimes(1);
  });
});
