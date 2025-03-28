import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NotesPage from "@components/notes/NotesPage";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: 1, title: "Test Note", category: "Work", content: "Hello" },
    ]),
  })
) as jest.Mock;

describe("NotesPage Component", () => {
  it("fetches and displays notes", async () => {
    render(<NotesPage />);
    
    expect(screen.getByText("Loading notes...")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("Test Note")).toBeInTheDocument());
  });

  it("filters notes when searching", async () => {
    render(<NotesPage />);

    await waitFor(() => expect(screen.getByText("Test Note")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("Search notes..."), {
      target: { value: "random" }
    });

    expect(screen.getByText("No notes found")).toBeInTheDocument();
  });

  it("opens and closes NoteEditor when clicking a note", async () => {
    render(<NotesPage />);

    await waitFor(() => expect(screen.getByText("Test Note")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Test Note"));
    
    expect(screen.getByText("Editing Note")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    
    expect(screen.queryByText("Editing Note")).not.toBeInTheDocument();
  });
});
