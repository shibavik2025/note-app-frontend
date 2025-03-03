import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import NoteEditor from "./NoteEditor";
import "@testing-library/jest-dom";

// Mock API URL
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Mock AI components
jest.mock("@components/ai-features/summarize/Summarizing", () => () => <div>Summarizing</div>);
jest.mock("@components/ai-features/categorize/Categorizing", () => () => <div>Categorizing</div>);
jest.mock("@components/ai-features/sentiment/SentimentAnalyze", () => () => <div>Sentiment Analysis</div>);

// Mock props
const mockNote = { id: 1, title: "Test Note", content: "Test content", category: "Work" };
const mockOnClose = jest.fn();
const mockRefreshNotes = jest.fn();

describe("NoteEditor Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with existing note", () => {
    render(<NoteEditor note={mockNote} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);
    
    expect(screen.getByText("✏️ Edit Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test content")).toBeInTheDocument();
  });

  test("renders correctly for new note", () => {
    render(<NoteEditor note={null} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);
    
    expect(screen.getByText("🆕 New Note")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Start typing your note here...")).toHaveValue("");
  });

  test("saves a note", async () => {
    render(<NoteEditor note={mockNote} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(mockRefreshNotes).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls API to delete note and triggers onClose & refreshNotes", async () => {
    render(<NoteEditor note={mockNote} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);

    const deleteButton = screen.getByText("Delete");

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        `https://mockapi.com/notes/1`, 
        { method: "DELETE" }
      )
    );

    expect(mockRefreshNotes).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
  test("closes the editor", () => {
    render(<NoteEditor note={mockNote} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("disables AI Analysis button when content is empty", () => {
    render(<NoteEditor note={{ id: 2, title: "", content: "", category: "" }} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);
    
    const aiButton = screen.getByText("AI Analysis");
    expect(aiButton).toBeDisabled();
  });

  test("enables AI Analysis button when content is present", () => {
    render(<NoteEditor note={mockNote} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);
    
    const aiButton = screen.getByText("AI Analysis");
    expect(aiButton).not.toBeDisabled();
  });

  test("shows AI analysis section when AI Analysis is clicked", async () => {
    render(<NoteEditor note={mockNote} onClose={mockOnClose} refreshNotes={mockRefreshNotes} />);

    const aiButton = screen.getByText("AI Analysis");

    // Click AI Analysis button
    await act(async () => {
      fireEvent.click(aiButton);
    });

    // Wait for AI Analysis components to appear
    await waitFor(() => {
      expect(screen.getByText("Summarizing")).toBeInTheDocument();
      expect(screen.getByText("Categorizing")).toBeInTheDocument();
      expect(screen.getByText("Sentiment Analysis")).toBeInTheDocument();
    });
  });
});
