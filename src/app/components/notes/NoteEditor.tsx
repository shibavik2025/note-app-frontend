"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, X } from "lucide-react";
import { categories } from "@/app/types/common";
import SentimentComponent from "@components/sentiment/SentimentAnalyze";

// Interface for Note object
interface Note {
  id?: number;
  title: string;
  category: string;
  content: string;
  created_at?: string;
}

// Props for the NoteEditor component
interface NoteEditorProps {
  note: Note | null;
  onClose: () => void;
  refreshNotes: () => void;
}

// The NoteEditor component
export default function NoteEditor({ note, onClose, refreshNotes }: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Note>(note || { id: 0, title: "", content: "", category: "" });

  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const [category, setCategory] = useState<string>("");
  const [isCategorizing, setIsCategorizing] = useState<boolean>(false);
  
  // Function to generate summary
  async function generateSummary(content: string) {
    setIsSummarizing(true);
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  
    const data = await res.json();
    setSummary(data.summary);
    setIsSummarizing(false);
  }
  

  // Function to categorize text
  async function generateCategory(content: string) {
    setIsCategorizing(true);
    const res = await fetch("/api/categorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  
    const data = await res.json();
    console.log("Category value", data.category);
    setCategory(data.category);
    setIsCategorizing(false);
  }
  

  useEffect(() => {
    setEditedNote(note || { id: 0, title: "", content: "", category: "" });
  }, [note]);

  // Save handler
  async function handleSave() {
    if (!editedNote) return;

    const updatedNote = {
      ...editedNote,
      content: editedNote.content,
      title:editedNote.title,
      category:editedNote.category
    };

    console.log("editedNote.content", editedNote.content);
    const method = editedNote.id ? "PUT" : "POST";
    const url = editedNote.id
      ? `http://127.0.0.1:8000/notes/${editedNote.id}`
      : `http://127.0.0.1:8000/notes`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    });

     // Generate summary after saving
      await generateSummary(editedNote.content);
      await generateCategory(editedNote.content);
      // refreshNotes();
      // onClose();
  }

  // Delete handler
  async function handleDelete() {
    if (editedNote.id) {
      await fetch(`http://127.0.0.1:8000/notes/${editedNote.id}`, {
        method: "DELETE",
      });
      refreshNotes();
      onClose();
    }
  }

  return (
    <div className="w-1/3 p-6 bg-white border-l shadow-lg fixed right-0 top-0 h-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editedNote.id ? "✏️ Edit Note" : "🆕 New Note"}
      </h2>
  
      <label className="block mb-2 font-medium text-gray-700">Title</label>
      <input
        type="text"
        value={editedNote.title}
        onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">Category</label>
      <select
        value={editedNote.category || ""}
        onChange={(e) => setEditedNote({ ...editedNote, category: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {/* Textarea for the content */}
      <label className="block mb-2 font-medium text-gray-700">Content</label>
      <textarea
        value={editedNote.content}
        onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 mb-4"
        placeholder="Start typing your note here..."
      />

      <div className="flex gap-1 mt-1">
        <button onClick={handleSave} className="flex items-center gap-1 bg-blue-500/80 hover:bg-blue-500 text-white px-5 py-2 rounded-md shadow">
          <Save size={18} /> Save
        </button>

        {editedNote.id !== 0 && (
          <button onClick={handleDelete} className="flex items-center gap-1 bg-red-500/80 hover:bg-red-500 text-white px-5 py-2 rounded-md shadow">
            <Trash2 size={18} /> Delete
          </button>
        )}

        <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-500/80 hover:text-gray-500">
          <X size={22} />
        </button>
      </div>

        {/* AI Analysis Section */}
        <div className="mt-6 space-y-4">
          {/* AI Summary */}
          {summary && (
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full">
              <h3 className="font-semibold text-gray-700 mb-1">🔍 AI Summary</h3>
              <p className="text-gray-800">{summary}</p>
            </div>
          )}
          {isSummarizing && <p className="text-gray-500">Summarizing...</p>}

          {/* AI Category */}
          {category && (
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full">
              <h3 className="font-semibold text-gray-700 mb-1">📂 AI Category</h3>
              <p className="text-gray-800">{category}</p>
            </div>
          )}
          {isCategorizing && <p className="text-gray-500">Categorizing...</p>}

          {/* AI Sentiment Analysis */}
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full">
            <h3 className="font-semibold text-gray-700 mb-1">AI Sentiment</h3>
            <SentimentComponent content={editedNote.content} />
          </div>
        </div>

    </div>
   
  )
}