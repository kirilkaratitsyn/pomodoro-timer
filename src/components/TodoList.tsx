import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, ChevronDown, ChevronUp, Pencil } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  notes: string;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [expandedTodo, setExpandedTodo] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<number | null>(null);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: newTodo.trim(), 
        completed: false,
        notes: ''
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (expandedTodo === id) setExpandedTodo(null);
    if (editingNote === id) setEditingNote(null);
  };

  const updateNotes = (id: number, notes: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, notes } : todo
    ));
  };

  const toggleExpand = (id: number) => {
    setExpandedTodo(expandedTodo === id ? null : id);
    setEditingNote(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tasks</h2>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 sm:hidden" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </form>

      <div className="space-y-3">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="flex-shrink-0 text-gray-500 hover:text-green-500 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <span className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'} truncate`}>
                  {todo.text}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => toggleExpand(todo.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {expandedTodo === todo.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedTodo === todo.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Notes</span>
                  <button
                    onClick={() => setEditingNote(editingNote === todo.id ? null : todo.id)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                {editingNote === todo.id ? (
                  <textarea
                    value={todo.notes}
                    onChange={(e) => updateNotes(todo.id, e.target.value)}
                    placeholder="Add notes here..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    autoFocus
                  />
                ) : (
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {todo.notes || 'No notes added yet.'}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};