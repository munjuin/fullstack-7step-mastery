// TodoItem.tsx
import React from 'react';
import { Todo } from './App'; // 인터페이스 불러오기

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void; // 함수 타입 정의
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => {
  return (
    <li 
      onClick={() => onToggle(todo.id)}
      style={{ 
        textDecoration: todo.completed ? 'line-through' : 'none',
        cursor: 'pointer'
      }}
    >
      {todo.text}
    </li>
  );
};

export default TodoItem;