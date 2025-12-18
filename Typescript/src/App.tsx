import React, { useState } from 'react';

// Props 인터페이스 정의
interface ButtonProps {
  label: string;
  onClick: () => void;
  color?: 'blue' | 'red';
}

// 컴포넌트 정의
const CustomButton: React.FC<ButtonProps> = ({ label, onClick, color = 'blue' }) => {
  const style = {
    backgroundColor: color === 'blue' ? '#3b82f6' : '#ef4444',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    margin: '5px'
  };

  return <button style={style} onClick={onClick}>{label}</button>;
};

// 메인 앱 컴포넌트
export default function App() {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");

  // 함수 이름 수정됨
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>React + TypeScript 실습</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>입력 테스트: <strong>{text}</strong></p>
        <input 
          type="text" 
          onChange={handleChange} 
          placeholder="여기에 입력하세요"
          style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div>
        <p>카운트: <strong>{count}</strong></p>
        <CustomButton label="증가" onClick={() => setCount(count + 1)} color="blue" />
        <CustomButton label="초기화" onClick={() => setCount(0)} color="red" />
      </div>
    </div>
  );
}