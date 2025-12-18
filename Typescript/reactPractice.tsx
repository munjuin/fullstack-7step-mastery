import React, { useState } from 'react';

/**
 * 1. Props 인터페이스 정의
 * 부모로부터 어떤 데이터를 받을지 미리 약속합니다.
 */
interface ButtonProps {
  label: string;
  onClick: () => void;
  // 유니온 타입을 활용해 특정 문자열만 허용합니다.
  color?: 'blue' | 'red' | 'green'; 
  // 옵셔널(?) 처리를 통해 필수가 아닌 속성을 만듭니다.
  disabled?: boolean;
}

/**
 * 2. 컴포넌트 정의
 * React.FC(Functional Component)를 사용하면 props에 정의한 타입이 자동 적용됩니다.
 */
const CustomButton: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  color = 'blue', 
  disabled = false 
}) => {
  // 테일윈드 클래스를 동적으로 할당하는 예시
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bg-green-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${colorClasses[color]} text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
};

/**
 * 3. 메인 앱 컴포넌트
 * 상태 관리(useState)와 이벤트 핸들링에 타입을 적용합니다.
 */
export default function App() {
  // useState에 제네릭 <number>를 사용하여 count가 항상 숫자임을 보장합니다.
  const [count, setCount] = useState<number>(0);
  
  // 복잡한 상태(객체)를 관리할 때의 제네릭 사용 예시
  interface UserStatus {
    id: string;
    isLoggedIn: boolean;
  }
  const [user, setUser] = useState<UserStatus>({ id: 'guest', isLoggedIn: false });

  // 이벤트 객체 타입 지정: HTMLInputElement에서 발생하는 변경 이벤트임을 명시
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("입력된 값:", e.target.value);
  };

  const toggleLogin = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: !prev.isLoggedIn
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center gap-8 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">React + TS 실전 실습</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg mb-2">현재 카운트: <span className="font-bold text-blue-600">{count}</span></p>
          <div className="flex justify-center gap-2">
            <CustomButton label="증가" onClick={() => setCount(count + 1)} color="blue" />
            <CustomButton label="초기화" onClick={() => setCount(0)} color="red" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
            이벤트 타입 테스트 (콘솔 확인)
          </label>
          <input
            type="text"
            onChange={handleInputChange}
            placeholder="아무거나 입력해보세요"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="mb-4">사용자 상태: {user.isLoggedIn ? '✅ 로그인됨' : '❌ 로그아웃됨'}</p>
          <CustomButton 
            label={user.isLoggedIn ? "로그아웃" : "로그인하기"} 
            onClick={toggleLogin} 
            color="green" 
          />
        </div>
      </div>

      <div className="text-sm text-gray-500 max-w-md">
        <p>💡 <strong>팁:</strong> VSCode에서 <code>CustomButton</code>에 마우스를 올려보세요. 우리가 정의한 <code>ButtonProps</code>가 나타나나요? 그것이 타입스크립트의 힘입니다!</p>
      </div>
    </div>
  );
}