import React, { useState, useEffect } from "react";
import { Save, Trash2, X, BrainCircuit } from "lucide-react";
import { categories } from "@/app/types/common";
import SentimentComponent from "@components/ai-features/sentiment/SentimentAnalyze";
import { API_URL } from "@/app/utils/common";
import Summarizing from "@components/ai-features/summarize/Summarizing";
import Categorizing from "@components/ai-features/categorize/Categorizing";

interface Note {
  id?: number;
  title: string;
  category: string;
  content: string;
  created_at?: string;
}

interface NoteEditorProps {
  note: Note | null;
  onClose: () => void;
  refreshNotes: () => void;
}

export default function NoteEditor({ note, onClose, refreshNotes }: NoteEditorProps) {
  const [editedNote, setEditedNote] = useState<Note>(note || { id: 0, title: "", content: "", category: "" });
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedNote(note || { id: 0, title: "", content: "", category: "" });
  }, [note]);

  // Save handler
  async function handleSave() {
    if (!editedNote) return;
    setIsSaving(true);

    try {
      const method = editedNote.id ? "PUT" : "POST";
      const url = editedNote.id ? `${API_URL}/notes/${editedNote.id}` : `${API_URL}/notes`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedNote),
      });

      refreshNotes();
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  }

  // Delete handler
  async function handleDelete() {
    if (!editedNote.id) return;

    try {
      await fetch(`${API_URL}/notes/${editedNote.id}`, { method: "DELETE" });
      refreshNotes(); // Refresh after delete
      onClose(); // Close editor
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  }

  return (
    <div className="w-1/3 p-6 bg-white border-l shadow-lg fixed right-0 top-0 h-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editedNote.id ? "✏️ Edit Note" : "🆕 New Note"}
      </h2>

      {/* Title Input */}
      <label className="block mb-2 font-medium text-gray-700">Title</label>
      <input
        type="text"
        value={editedNote.title}
        onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {/* Category Dropdown */}
      <label className="block mb-2 font-medium text-gray-700">Category</label>
      <select
        value={editedNote.category || ""}
        onChange={(e) => setEditedNote({ ...editedNote, category: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Content Input */}
      <label className="block mb-2 font-medium text-gray-700">Content</label>
      <textarea
        value={editedNote.content}
        onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 mb-4"
        placeholder="Start typing your note here..."
      />

      {/* Buttons */}
      <div className="flex gap-2 mt-1">
        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1 px-5 py-2 rounded-md shadow ${
            isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700/80 hover:bg-blue-500 text-white"
          }`}
          disabled={isSaving}
        >
          <Save size={18} /> {isSaving ? "Saving..." : "Save"}
        </button>

        {/* AI Analysis Button */}
        <button
          onClick={() => setShowAIAnalysis(true)}
          className={`flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md shadow-md transition ${
            !editedNote.content ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!editedNote.content}
        >
          <BrainCircuit size={18} /> AI Analysis
        </button>

        {/* Delete Button */}
        {editedNote.id !== 0 && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 bg-red-500/80 hover:bg-red-500 text-white px-5 py-2 rounded-md shadow"
          >
            <Trash2 size={18} /> Delete
          </button>
        )}

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 p-2 text-gray-500/80 hover:text-gray-500" data-testid="close-button">
          <X size={22} />
        </button>
      </div>

      {/* AI Analysis Section */}
      {showAIAnalysis && (
        <div className="mt-6 space-y-4">
          <Summarizing content={editedNote.content} />
          <Categorizing content={editedNote.content} />
          <SentimentComponent content={editedNote.content} />
        </div>
      )}
    </div>
  );
}
