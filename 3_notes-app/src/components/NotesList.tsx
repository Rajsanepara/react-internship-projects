import React from 'react';
import type { Note } from '../types/note';

interface NotesListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const NotesList: React.FC<NotesListProps> = ({ notes, activeNoteId, onSelect, onAdd, onDelete }) => {
  return (
    <div className="notes-sidebar">
      <div className="sidebar-header">
        <h2>My Notes</h2>
        <button onClick={onAdd} className="btn-add">
          + New
        </button>
      </div>
      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-msg">No notes yet.</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
            >
              <div 
                className="note-item-content" 
                onClick={() => onSelect(note.id)}
              >
                <div className="note-title">
                  {note.content.split('\n')[0].replace(/#/g, '').trim() || 'Untitled Note'}
                </div>
                <div className="note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button 
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
