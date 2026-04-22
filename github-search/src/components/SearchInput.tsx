import React, { useRef, useEffect } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input automatically on mount
    inputRef.current?.focus();
  }, []);

  return (
    <div className="search-container">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search GitHub users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
