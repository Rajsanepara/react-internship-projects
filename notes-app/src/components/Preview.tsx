import { useMemo, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface PreviewProps {
  content: string;
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ content }, ref) => {
  // Memoize markdown rendering for performance
  const renderedMarkdown = useMemo(() => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  }, [content]);

  return (
    <div className="preview-container" ref={ref}>
      <div className="markdown-preview">
        {renderedMarkdown}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
