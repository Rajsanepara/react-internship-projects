import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNotes } from './hooks/useNotes';
import { useAutoSave } from './hooks/useAutoSave';
import { NotesList } from './components/NotesList';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const { notes, activeNoteId, setActiveNoteId, addNote, updateNote, deleteNote } = useNotes();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId), [notes, activeNoteId]);
  
  const [draftContent, setDraftContent] = useState<string>('');

  // Sync draft content with the underlying note whenever we switch activeNote
  useEffect(() => {
    if (activeNote) {
      setDraftContent(activeNote.content);
    } else {
      setDraftContent('');
    }
  }, [activeNoteId]); 

  // Auto-save logic hooks the draft content. Update DB when drafted input rests.
  useAutoSave(draftContent, 500, (savedContent) => {
    if (activeNoteId && savedContent !== activeNote?.content && !!activeNote) {
      updateNote(activeNoteId, savedContent);
    }
  });

  // Attach synchronised scroll directly via DOM events since we have Refs
  useEffect(() => {
    const editorEl = editorRef.current;
    if (!editorEl) return;

    const handleScroll = () => {
      if (!previewRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = editorEl;
      
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      const previewScrollHeight = previewRef.current.scrollHeight;
      const previewClientHeight = previewRef.current.clientHeight;
      
      previewRef.current.scrollTop = scrollPercentage * (previewScrollHeight - previewClientHeight);
    };

    editorEl.addEventListener('scroll', handleScroll);
    return () => editorEl.removeEventListener('scroll', handleScroll);
  }, [activeNoteId]); // Re-attach when pane mounts/unmounts (i.e. activeNoteId flips)

  return (
    <div className="app-container">
      <NotesList 
        notes={notes}
        activeNoteId={activeNoteId}
        onSelect={setActiveNoteId}
        onAdd={addNote}
        onDelete={deleteNote}
      />
      
      <div className="main-content">
        <header className="app-header">
          <h1>Antigravity Notes</h1>
          <ThemeToggle />
        </header>

        {activeNoteId ? (
          <div className="workspace">
            <div className="pane">
              <Editor 
                ref={editorRef}
                content={draftContent}
                onChange={setDraftContent}
                isActive={!!activeNoteId}
              />
            </div>
            
            <div className="pane">
              <Preview 
                ref={previewRef}
                content={draftContent}
              />
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a note to start editing, or create a new one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
