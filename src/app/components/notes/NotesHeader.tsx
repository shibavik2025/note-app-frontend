import { Plus } from "lucide-react";
import SearchBar from "@/app/components/search/SearchBar";

interface NotesHeaderProps {
  onSearch: (query: string, category: string) => void;
  onAddNote: () => void;
}

export default function NotesHeader({ onSearch, onAddNote }: NotesHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">📝 Your Notes</h1>

      {/* SearchBar component */}
      <SearchBar onSearch={onSearch} />

      {/* Add New Note Button */}
      <button
        onClick={onAddNote}
        className="flex items-center gap-2 bg-emerald-500/80 hover:bg-emerald-500 text-white px-5 py-2 rounded-md shadow"
      >
        <Plus size={18} /> Add Note
      </button>
    </div>
  );
}
