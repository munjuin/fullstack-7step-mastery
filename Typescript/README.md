# 📘 TypeScript 7-Step Mastery Practice

이 레포지토리는 TypeScript의 기초부터 React 실무 적용까지, **7단계 학습법**을 통해 단계별로 정복해 나가는 과정을 기록한 공간입니다. 자바스크립트의 유연함에 타입스크립트의 안정성을 더해가는 여정을 담고 있습니다.

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Library/Framework:** React (Vite)
- **State Management:** useState, Custom Hooks
- **Tooling:** Vite, npm, tsc

---

## 📚 학습 과정 및 주요 내용

### Part 1: TypeScript 문법 기초 (Basics)

가장 기본이 되는 타입 시스템과 객체 설계의 기초를 다졌습니다.

- **기본 타입 적용:** `string`, `number`, `boolean`, `unknown`, `Union Type` 활용
- **Interface vs Type Alias:** 객체 모양 정의 및 확장성(`extends` vs `&`)의 차이 이해
- **타입 가딩 (Narrowing):** `typeof`와 조건문을 통해 타입을 좁혀나가는 안정적인 코드 작성
- **Optional & Readonly:** 인터페이스 내 선택적 속성과 읽기 전용 속성 활용

### Part 2: 실전 React & 심화 (Advanced)

TypeScript를 실제 React 프로젝트에 적용하고 재사용 가능한 로직을 설계했습니다.

- **제네릭 (Generics):** 타입을 파라미터처럼 사용하여 재사용성과 안정성을 동시에 잡는 법 습득
- **React 컴포넌트 타이핑:** `Props` 인터페이스 정의 및 `React.FC`를 통한 컴포넌트 타입화
- **이벤트 및 상태 타이핑:** `ChangeEvent`, `KeyboardEvent` 등 브라우저 이벤트 객체의 정확한 타입 지정
- **커스텀 훅 (Custom Hooks):** 제네릭을 적용한 `useLocalStorage<T>`를 직접 구현하여 로직 분리 및 데이터 영속성(Persistence) 구현

---

## 🚀 주요 실습 프로젝트: Persistent To-Do App

단순한 할 일 목록을 넘어, TypeScript의 심화 개념을 모두 쏟아부은 프로젝트입니다.

- **특징:** - 제네릭 훅을 통해 어떤 데이터 타입이든 `localStorage`와 동기화 가능
  - 컴포넌트 분리 및 명확한 Props 타입 정의
  - 새로고침 시에도 데이터가 유지되는 완벽한 사용자 경험

---

## 📂 프로젝트 구조

```text
Typescript/
├── src/
│   ├── App.tsx          # React + TS 통합 실습 (To-Do App)
│   ├── main.tsx         # React 앱 진입점
│   ├── Experiment.ts    # 제네릭 및 에러 분석 실험 파일
│   ├── practice.ts      # Part 1 기본 문법 실습
│   ├── mission.ts       # Part 1 미션 구현 파일
│   └── extension.ts     # Part 1 인터페이스 확장 실습
├── index.html           # Vite 진입점
├── tsconfig.json        # TS 설정 파일
└── README.md            # 프로젝트 학습 기록
```

## ⚙️ 실행 방법 (How to Run)

본 프로젝트는 **Vite**를 빌드 도구로 사용하며, React와 TypeScript 환경에서 실행됩니다.

### 1. 필수 라이브러리 설치

프로젝트에 필요한 패키지(React, Vite, Lucide-React 등)를 설치합니다.

```bash
npm install
```

### 2. 로컬 개발 서버 실행

Vite를 사용하여 개발 서버를 구동합니다. 코드를 수정하면 브라우저에 실시간으로 반영됩니다.

```bash
npm run dev
```

### 3. TypeScript 타입 체크 (선택 사항)

실시간 에러 확인 외에, 프로젝트 전체의 타입 무결성을 한 번에 검사하고 싶을 때 사용합니다.

```bash
npx tsc
```

### 4. 배포용 빌드

실제 서비스 환경에 최적화된 정적 파일들을 생성합니다.

```bash
npm run build
```

실행 후 생성되는 dist 폴더 내의 파일들을 웹 서버에 업로드하여 배포할 수 있습니다.

---

## 📂 주요 파일 구성 및 역할

- **`src/App.tsx`**: **[핵심 실습]** 제네릭 커스텀 훅(`useLocalStorage`)을 활용한 실전 To-Do 애플리케이션입니다. React 컴포넌트, Props, State 전반에 TypeScript가 적용되어 있습니다.
- **`src/main.tsx`**: React 애플리케이션의 진입점(Entry Point)입니다. Vite 빌드 도구와 연결되어 전체 앱을 브라우저에 렌더링합니다.
- **`src/Experiment.ts`**: 제네릭의 제약 조건(`extends`) 및 타입 추론을 깊이 있게 이해하기 위해 의도적으로 에러를 발생시키며 실험한 기록입니다.
- **`tsconfig.json`**: TypeScript 컴파일러 설정 파일입니다. JSX 처리 방식, 엄격 모드(Strict Mode), 모듈 시스템 등을 정의하여 프로젝트의 규칙을 설정했습니다.

---

## 🎓 학습 성과 및 최종 소감

### 1단계 ~ 7단계를 통한 성장

- **Part 1 (기초 정복):** 변수, 함수, 인터페이스의 기본 문법을 익히고, `Narrowing`과 `Optional Property` 등을 통해 자바스크립트의 고질적인 런타임 에러를 사전에 방지하는 법을 배웠습니다.
- **Part 2 (실전/심화):** **제네릭(Generic)**의 개념을 완벽히 이해하고, 이를 리액트 커스텀 훅에 적용하여 재사용성이 높은 코드를 설계하는 법을 습득했습니다. 또한 리액트의 복잡한 이벤트 객체와 상태에 정확한 타입을 입히는 실무 역량을 갖추게 되었습니다.

### 최종 소감

처음에는 타입스크립트의 엄격한 규칙과 '빨간 줄'이 낯설게 느껴지기도 했지만, 학습을 진행하며 그것이 개발자의 실수를 실시간으로 잡아주는 **가장 든든한 안전장치**라는 것을 깨달았습니다. 특히 제네릭을 사용하여 어떤 데이터 타입에도 대응하는 로컬 스토리지 연동 로직을 직접 구현해 본 경험은 앞으로의 개발 과정에서 큰 자신감이 될 것 같습니다. 이제 TypeScript는 저에게 신뢰할 수 있는 최고의 개발 파트너입니다!

---

**학습 완료일:** 2025-12-19
**작성자:** [문주인]
