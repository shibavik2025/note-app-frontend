import { Note } from "../../types/note";
import { categoryColors } from "../../types/common";

interface NotesTableProps {
  notes: Note[];
  onSelectNote: (note: Note) => void;
  loading: boolean;
}

export default function NotesTable({ notes, onSelectNote, loading }: NotesTableProps) {
  return loading ? (
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
          {notes.length > 0 ? (
            notes.map((note) => (
              <tr
                key={note.id}
                className="shadow-sm hover:shadow-md hover:bg-blue-100 cursor-pointer transition"
                onClick={() => onSelectNote(note)}
              >
                <td className="px-8 pl-20 py-3 text-gray-800 text-left">{note.title}</td>
                <td className="px-3 py-3 text-center">
                  <div className="flex items-center justify-left gap-3">
                    <span
                      className={`inline-block w-5 h-5 rounded-full`}
                      style={{
                        backgroundColor: categoryColors[note.category] || "gray",
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
  );
}
