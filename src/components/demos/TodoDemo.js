import React, { useState, useEffect } from 'react';

const TodoDemo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [nextId, setNextId] = useState(1);

  // Sample initial todos
  useEffect(() => {
    const initialTodos = [
      { id: 1, text: 'Build portfolio website', completed: true, priority: 'high', category: 'work' },
      { id: 2, text: 'Learn React advanced patterns', completed: false, priority: 'medium', category: 'learning' },
      { id: 3, text: 'Set up CI/CD pipeline', completed: false, priority: 'high', category: 'work' },
      { id: 4, text: 'Practice TypeScript', completed: false, priority: 'low', category: 'learning' }
    ];
    setTodos(initialTodos);
    setNextId(5);
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: nextId,
        text: newTodo.trim(),
        completed: false,
        priority: 'medium',
        category: 'general',
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
      setNextId(nextId + 1);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodoPriority = (id, priority) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2">Todo Manager</h3>
        
        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>Total: {stats.total}</span>
          <span>Active: {stats.active}</span>
          <span>Done: {stats.completed}</span>
        </div>

        {/* Add Todo */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
          >
            +
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`
                px-3 py-1 rounded text-xs font-medium transition-colors capitalize
                ${filter === filterType 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {filterType}
            </button>
          ))}
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
            >
              Clear Done
            </button>
          )}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {getFilteredTodos().length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </div>
        ) : (
          getFilteredTodos().map((todo) => (
            <div
              key={todo.id}
              className={`
                p-3 rounded border transition-all
                ${todo.completed 
                  ? 'bg-gray-700 border-gray-600 opacity-75' 
                  : 'bg-gray-750 border-gray-600 hover:border-gray-500'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`
                    mt-1 w-4 h-4 rounded border-2 flex items-center justify-center
                    ${todo.completed 
                      ? 'bg-cyan-600 border-cyan-600' 
                      : 'border-gray-400 hover:border-cyan-400'
                    }
                  `}
                >
                  {todo.completed && <span className="text-white text-xs">✓</span>}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={`
                    text-sm break-words
                    ${todo.completed 
                      ? 'text-gray-400 line-through' 
                      : 'text-white'
                    }
                  `}>
                    {todo.text}
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {todo.category}
                    </span>
                    
                    {/* Priority Selector */}
                    <select
                      value={todo.priority}
                      onChange={(e) => updateTodoPriority(todo.id, e.target.value)}
                      className="text-xs bg-gray-700 border border-gray-600 rounded px-1 text-gray-300"
                      disabled={todo.completed}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    
                    <span className="text-xs">
                      {getPriorityIcon(todo.priority)}
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Demo notice */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Interactive demo - changes are not persistent
      </div>
    </div>
  );
};

export default TodoDemo;