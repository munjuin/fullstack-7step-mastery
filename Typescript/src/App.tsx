// App.tsx
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { Todo } from './types';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // Generics를 사용한 상태 관리
  const [inputValue, setInputValue] = useState<string>("");

  // 할 일 추가 함수
  const addTodo = () => {
    if (inputValue.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  // 완료 상태 토글 함수
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Jewelry Shop To-Do</h1>
      
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>

      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
        ))}
      </ul>
    </div>
  );
};

export default App;