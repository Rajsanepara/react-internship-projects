import { useCallback } from 'react';
import type { Todo } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todo_app_state', []);

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return;

    setTodos(prev => [
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
