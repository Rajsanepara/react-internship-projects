import { useEffect, useRef, forwardRef } from 'react';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  isActive: boolean;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(({ content, onChange, isActive }, ref) => {
  const localRef = useRef<HTMLTextAreaElement | null>(null);

  // Expose the ref out for scroll syncing and use an internal ref for logic
  const handleRef = (el: HTMLTextAreaElement) => {
    localRef.current = el;
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  useEffect(() => {
    // Auto-focus when note becomes active
    if (isActive && localRef.current) {
      localRef.current.focus();
    }
  }, [isActive]);

  return (
    <div className="editor-container">
      <textarea
        ref={handleRef}
        className="markdown-editor"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your markdown..."
      />
    </div>
  );
});

Editor.displayName = 'Editor';
