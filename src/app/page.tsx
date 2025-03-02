"use client";

import { useState, useEffect } from "react";
import NoteEditor from "@components/notes/NoteEditor";
import { Plus } from "lucide-react";
import SearchBar from "@/app/components/notes/SearchBar";
import { categoryColors } from "@/app/types/common"; // Make sure this contains the correct color values

interface Note {
  id?: number;
  title: string;
  category: string;
  content: string;
  created_at?: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  // Fetching notes from the API
  async function fetchNotes() {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/notes");
    const data = await res.json();
    setNotes(data);
    setFilteredNotes(data); // Initially show all notes
    setLoading(false);
  }

  useEffect(() => {
    fetchNotes(); // Fetch notes when the component mounts
  }, []);

  function refreshNotes() {
    fetchNotes();
  }

  // Search handler: filters notes based on the search query and category
  function handleSearch(query: string, category: string) {
    const lowercasedQuery = query.toLowerCase();

    const filtered = notes.filter(
      (note) =>
        (note.title.toLowerCase().includes(lowercasedQuery) ||
          note.content.toLowerCase().includes(lowercasedQuery)) &&
        (category ? note.category === category : true)
    );

    setFilteredNotes(filtered);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-2/3 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📝 Your Notes</h1>

          {/* SearchBar component */}
          <SearchBar onSearch={handleSearch} />

          {/* Add New Note Button */}
          <button
            onClick={() => setSelectedNote({ title: "", category: "", content: "" })}
            className="flex items-center gap-2 bg-emerald-500/80 hover:bg-emerald-500 text-white px-5 py-2 rounded-md shadow"
          >
            <Plus size={18} /> Add Note
          </button>
        </div>

        {/* Notes Table */}
        {loading ? (
          <p className="text-center text-gray-600">Loading notes...</p>
        ) : (
          <div className="overflow-hidden rounded-lg shadow-lg">
            <table className="w-full border-collapse bg-white rounded-lg">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-8 pl-20 py-4 text-left">Title</th>
                  <th className="px-3 py-3 text-left">Category</th>
                  <th className="px-3 py-3 text-center">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <tr
                      key={note.id}
                      className="shadow-sm hover:shadow-md hover:bg-blue-100 cursor-pointer transition"
                      onClick={() => setSelectedNote(note)}
                    >
                      <td className="px-8 pl-20 py-3 text-gray-800 text-left">{note.title}</td>
                      <td className="px-3 py-3 text-center">
                        {/* Category circle display */}
                        <div className="flex items-center justify-left gap-3">
                          {/* Category Circle */}
                          <span
                            className={`inline-block w-5 h-5 rounded-full`}
                            style={{
                              backgroundColor: categoryColors[note.category] || "gray", // Use category color or default to gray
                              border: "1px solid white", 
                            }}
                          ></span>
                          {note.category}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-800 text-center">
                        {note?.created_at && new Date(note?.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-center text-gray-600">
                      No notes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedNote && (
        <NoteEditor note={selectedNote} onClose={() => setSelectedNote(null)} refreshNotes={refreshNotes} />
      )}
    </div>
  );
}
