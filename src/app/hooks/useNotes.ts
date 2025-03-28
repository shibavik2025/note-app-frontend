import { useEffect, useState } from "react";
import { API_URL } from "@utils/common";
import { Note } from "../types/note";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);


  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notes`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function refreshNotes() {
    fetchNotes();
  }

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

  return { notes, filteredNotes, loading, refreshNotes, handleSearch };
}
