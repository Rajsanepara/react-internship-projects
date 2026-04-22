import { useMemo } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { FilterBar } from './components/FilterBar';
import { useTodos } from './hooks/useTodos';
import { useFilter } from './hooks/useFilter';
import './App.css';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const { filter, setFilter } = useFilter();

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      case 'all':
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(() => {
    return todos.filter(t => !t.completed).length;
  }, [todos]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Taskify</h1>
        <p className="app-subtitle">Stay organized, stay creative.</p>
      </header>

      <main className="todo-main">
        <TodoInput onAdd={addTodo} />
        
        <div className="todo-controls">
          <span className="items-left">
            {activeCount} {activeCount === 1 ? 'item' : 'items'} left
          </span>
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </div>

        <TodoList 
          todos={filteredTodos} 
          onToggle={toggleTodo} 
          onDelete={deleteTodo} 
        />
      </main>
      
      <footer className="app-footer">
        <p>Built with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
