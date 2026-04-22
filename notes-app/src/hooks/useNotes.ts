import { useState, useEffect, useCallback } from 'react';
import type { Note } from '../types/note';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('markdown-notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);

  useEffect(() => {
    localStorage.setItem('markdown-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: '# New Note\n\nStart typing...',
      createdAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }, []);

  const updateNote = useCallback((id: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  }, []);
  
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const updatedNotes = prev.filter(note => note.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
      return updatedNotes;
    });
  }, [activeNoteId]);

  return { notes, activeNoteId, setActiveNoteId, addNote, updateNote, deleteNote };
};
