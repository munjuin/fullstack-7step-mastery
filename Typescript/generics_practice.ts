export {}

// [Part 2 - 3단계] 제네릭(Generic) 실습
// 타입을 파라미터처럼 넘겨주는 연습을 합니다.

// 1. 기본적인 제네릭 함수
// T는 사용자가 함수를 호출할 때 결정됩니다.
function identity<T>(arg: T): T {
  return arg;
}

const output1 = identity<string>("myString");
const output2 = identity<number>(100);

// 2. 인터페이스와 제네릭
// 데이터의 구조는 같지만 내부 데이터 타입만 바뀔 때 유용합니다.
interface Box<T> {
  content: T;
  isOpen: boolean;
}

const stringBox: Box<string> = {
  content: "선물",
  isOpen: true
};

const numberBox: Box<number> = {
  content: 2024,
  isOpen: false
};

// 3. 제네릭 제약 조건 (Constraints)
// T가 최소한 length 속성을 가진 타입이어야 함을 명시합니다.
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // 이제 length 속성에 접근 가능!
  return arg;
}

loggingIdentity([1, 2, 3]); // 배열은 length가 있으므로 OK
// loggingIdentity(3); // 에러! 숫자는 length가 없음