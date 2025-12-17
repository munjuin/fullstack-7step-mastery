# TypeScript Practice (Part 1)

이 레포지토리는 TypeScript의 핵심 문법을 익히고 실습한 코드를 저장하는 공간입니다.
자바스크립트에 타입을 입혀 안정성을 높이는 방법과 `Interface`를 활용한 객체 설계를 중점적으로 학습했습니다.

## 📚 학습 내용 (Part 1)

### 1. 기본 타입 (Primitive & Special Types)

- `string`, `number`, `boolean` 등 기본 타입 적용
- `any` 사용을 지양하고 `unknown`과 `Union Type` 활용
- 타입 가드(Type Guard)를 통한 Narrowing 실습

### 2. 객체와 타입 설계

- **Product 인터페이스 정의:**
  ```typescript
  interface Product {
    name: string;
    price: number;
    inStock: boolean;
    manufacturer?: string; // Optional Property
    calculateDiscount: (percent: number) => number; // Method Type
  }
  ```

### 3. 주요 실습 코드

- `practice.ts`: 기본 문법(변수, 함수, 객체 등) 및 타입 선언 연습
- `experiment.ts`: 고의로 에러를 발생시켜보며 에러 메시지 분석 및 Narrowing 연습
- `mission.ts`: 상품(Product) 데이터 필터링 로직 백지 구현 미션
- `extension.ts`: 객체 메소드 타입 정의 및 Interface vs Type Alias 비교 실습

## 🚀 How to Run

1. 의존성 설치: `npm install`
2. 컴파일: `tsc`
3. 실행: `node [파일명].js` (예: `node mission.js`)

---

_이 프로젝트는 [TypeScript 7단계 완전 정복 학습 계획]에 따라 진행되었습니다._
