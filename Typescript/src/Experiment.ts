// [Part 2 - 4단계 실험] 제네릭과 제약조건 테스트

// 1. 제네릭 함수 선언
// T는 무엇이든 될 수 있지만, 일단 들어오면 그 타입을 유지합니다.
function echo<T>(message: T): T {
  return message;
}

// [실험 A] 제네릭의 타입 추론 확인하기
const result1 = echo("Hello"); // result1은 string 타입
// result1.toFixed(2); 
// 👉 주석을 풀면 에러 발생! (문자열에는 toFixed 함수가 없으니까요)
// <CustomButton onClick={() => {}} /> 
// 👉 label이 없다고 빨간 줄이 뜹니다.



// 2. 제약조건(Constraints)이 있는 제네릭
// T는 아무거나 다 되는 게 아니라, 반드시 length 속성이 있어야 함!
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// [실험 B] 제약조건 위반해보기
logLength("abc"); // 문자열은 length가 있어서 통과
logLength([1, 2, 3]); // 배열도 length가 있어서 통과
// logLength(100); 
// 👉 주석을 풀면 에러 발생! (숫자 100에는 length가 없으니까요)
// 에러 메시지: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.

