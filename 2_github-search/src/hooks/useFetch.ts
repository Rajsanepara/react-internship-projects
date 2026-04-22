import { useState, useEffect } from 'react';
import type { FetchState } from '../types/github';

export function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!url) {
      // If URL is null or empty, don't fetch and reset state
      setState({ data: null, loading: false, error: null });
      return;
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch data');
        }

        const data = (await response.json()) as T;
        setState({ data, loading: false, error: null });
      } catch (error: any) {
        // Ignore abort errors as they are expected when cancelling
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error: error.message || 'Unknown error' });
        }
      }
    };

    fetchData();

    // Cleanup function aborts the fetch if url changes or component unmounts
    return () => {
      abortController.abort();
    };
  }, [url]);

  return state;
}
