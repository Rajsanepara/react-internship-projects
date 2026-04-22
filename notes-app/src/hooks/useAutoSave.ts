import { useEffect, useRef } from 'react';

/**
 * A custom hook that debounces a save action.
 * @param value The value to observe.
 * @param delay The debounce delay in milliseconds.
 * @param onSave The callback function executed after the delay.
 */
export const useAutoSave = (value: string, delay: number, onSave: (val: string) => void) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      onSave(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onSave]);
};
