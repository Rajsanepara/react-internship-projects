import { useState, useCallback } from 'react';
import type { FilterType } from '../types/todo';

export function useFilter(initialFilter: FilterType = 'all') {
  const [filter, setFilterState] = useState<FilterType>(initialFilter);

  const setFilter = useCallback((newFilter: FilterType) => {
    setFilterState(newFilter);
  }, []);

  return {
    filter,
    setFilter,
  };
}
