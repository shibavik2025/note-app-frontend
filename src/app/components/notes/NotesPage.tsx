"use client";

import { useState } from "react";
import NotesHeader from "@components/notes/NotesHeader";
import NotesTable from "@components/notes/NotesTable";
import NoteEditor from "@/app/components/note-editor/NoteEditor";
import { useNotes } from "@hooks/useNotes";
import { Note } from "../../types/note";

export default function NotesPage() {
  const { filteredNotes, loading, refreshNotes, handleSearch } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-2/3 p-6">
        <NotesHeader onSearch={handleSearch} onAddNote={() => setSelectedNote({ title: "", category: "", content: "" })} />
        <NotesTable notes={filteredNotes} onSelectNote={setSelectedNote} loading={loading} />
      </div>

      {selectedNote && <NoteEditor note={selectedNote} onClose={() => setSelectedNote(null)} refreshNotes={refreshNotes} />}
    </div>
  );
}
