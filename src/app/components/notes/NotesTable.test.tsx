import { render, screen, fireEvent } from "@testing-library/react";
import NotesTable from "@components/notes/NotesTable";
import { Note } from "../../types/note";

const mockNotes: Note[] = [
  { id: 1, title: "Note 1", category: "Work", content: "Work done", created_at: "2024-03-01" },
  { id: 2, title: "Note 2", category: "Personal",content: "Personal work", created_at: "2024-03-02" },
];

describe("NotesTable Component", () => {
  it("renders notes correctly", () => {
    render(<NotesTable notes={mockNotes} onSelectNote={jest.fn()} loading={false} />);
    
    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("03/01/2024")).toBeInTheDocument();
    
    expect(screen.getByText("Note 2")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("03/02/2024")).toBeInTheDocument();
  });

  it("calls onSelectNote when clicking on a note", () => {
    const mockOnSelectNote = jest.fn();
    render(<NotesTable notes={mockNotes} onSelectNote={mockOnSelectNote} loading={false}  />);

    fireEvent.click(screen.getByText("Note 1"));

    expect(mockOnSelectNote).toHaveBeenCalledWith(mockNotes[0]);
  });

  it("shows 'No notes found' when list is empty", () => {
    render(<NotesTable notes={[]} onSelectNote={jest.fn()} loading={false}  />);
    
    expect(screen.getByText("No notes found")).toBeInTheDocument();
  });
});
