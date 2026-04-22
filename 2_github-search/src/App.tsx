import React, { useState, useCallback } from 'react';
import { SearchInput } from './components/SearchInput';
import { UserCard } from './components/UserCard';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { useDebounce } from './hooks/useDebounce';
import { useFetch } from './hooks/useFetch';
import type { GitHubUser } from './types/github';

export const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Requirement: Debounce input (e.g. 500ms delay)
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  // Requirement: Do not call API if input is empty
  // We handle this by setting URL to null when searchTerm is empty
  const url = debouncedSearchTerm.trim() 
    ? `https://api.github.com/users/${debouncedSearchTerm.trim()}` 
    : null;

  // Requirement: Fetch data using GitHub public API
  const { data: user, loading, error } = useFetch<GitHubUser>(url);

  // Requirement: Use useCallback for event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <h1>GitHub Explorer</h1>
          </div>
          <p className="app-subtitle">Discover developers across the globe.</p>
        </header>

        <main className="app-main">
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
          
          <div className="results-container">
            {/* Show loader while fetching */}
            {loading && <Loader />}
            
            {/* Show error if user not found or API fails */}
            {!loading && error && <ErrorMessage message={error} />}
            
            {/* Display user profile */}
            {!loading && !error && user && <UserCard user={user} />}
            
            {/* Empty state when no search is active */}
            {!loading && !error && !user && !debouncedSearchTerm && (
              <div className="empty-state animate-in">
                <p>Type a username above to start exploring</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
