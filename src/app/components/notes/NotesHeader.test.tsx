import { render, screen, fireEvent } from "@testing-library/react";
import NotesHeader from "@components/notes/NotesHeader";

describe("NotesHeader Component", () => {
  it("renders correctly", () => {
    render(<NotesHeader onSearch={jest.fn()} onAddNote={jest.fn()} />);
    
    expect(screen.getByText("📝 Your Notes")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search notes...")).toBeInTheDocument();
    expect(screen.getByText("Add Note")).toBeInTheDocument();
  });

  it("calls onSearch when typing in search", () => {
    const mockOnSearch = jest.fn();
    render(<NotesHeader onSearch={mockOnSearch} onAddNote={jest.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText("Search notes..."), {
      target: { value: "test" }
    });

    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });

  it("calls onAddNote when Add Note button is clicked", () => {
    const mockOnAddNote = jest.fn();
    render(<NotesHeader onSearch={jest.fn()} onAddNote={mockOnAddNote} />);

    fireEvent.click(screen.getByText("Add Note"));

    expect(mockOnAddNote).toHaveBeenCalledTimes(1);
  });
});
