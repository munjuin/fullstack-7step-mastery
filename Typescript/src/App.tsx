import React, { useState } from 'react';

// 1. 할 일 데이터의 구조를 정의하는 인터페이스
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * 2. [6단계 핵심] 제네릭 커스텀 훅: useLocalStorage
 * <T>를 사용하여 어떤 타입의 데이터(숫자, 문자, 객체 배열 등)도 
 * 로컬 스토리지와 동기화할 수 있는 재사용 가능한 훅입니다.
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 로컬 스토리지에서 기존 데이터를 읽어오거나 초기값을 설정함
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 데이터가 있으면 파싱하고, 없으면 초기값을 사용
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("로컬스토리지 읽기 에러:", error);
      return initialValue;
    }
  });

  // 상태를 업데이트하고 동시에 로컬 스토리지에 저장하는 함수
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("로컬스토리지 저장 에러:", error);
    }
  };

  return [storedValue, setValue];
}

/**
 * 3. 메인 앱 컴포넌트
 */
export default function App() {
  // 커스텀 훅 호출 시 <Todo[]> 제네릭을 넘겨주어 타입 안정성을 확보함
  const [todos, setTodos] = useLocalStorage<Todo[]>('my-todo-list', []);
  const [inputValue, setInputValue] = useState<string>('');

  // 할 일 추가
  const addTodo = () => {
    if (!inputValue.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  // 완료 상태 토글
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // 할 일 삭제
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // 스타일 설정 (인라인 스타일)
  const containerStyle: React.CSSProperties = {
    maxWidth: '400px',
    margin: '50px auto',
    fontFamily: 'sans-serif',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#4f46e5' }}>TS Persistent To-Do</h2>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하세요"
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
        />
        <button 
          onClick={addTodo} 
          style={{ padding: '10px 15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          추가
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '10px',
            borderBottom: '1px solid #eee'
          }}>
            <div 
              onClick={() => toggleTodo(todo.id)} 
              style={{ 
                cursor: 'pointer', 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#aaa' : '#333'
              }}
            >
              {todo.completed ? '✅ ' : '⬜ '}
              {todo.text}
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)} 
              style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        새로고침해도 데이터가 유지됩니다! (LocalStorage 사용)
      </div>
    </div>
  );
}