export {};
// // [Part 1 - 6단계] 응용하고 확장하기

// // 미션 1: Product 타입에 '할인가 계산 메소드' 추가하기
// // 기존 코드에서 Product 인터페이스를 수정합니다.
// interface Product {
//   name: string;
//   price: number;
//   inStock: boolean;
//   manufacturer?: string;
//   // [추가된 부분]
//   // 할인율(percent)을 받아서 할인가(number)를 반환하는 함수 타입 정의
//   calculateDiscount: (percent: number) => number;
// }


// // 미션 2: 데이터에 실제 함수 구현하기
// const myLaptop: Product = {
//   name: "맥북 프로",
//   price: 2000000,
//   inStock: true,
//   manufacturer: "Apple",
//   // [추가된 부분] 실제 동작하는 함수 구현
//   calculateDiscount: function(percent: number) {
//     // 가격 * (1 - 할인율/100)
//     const discountPrice = this.price * (1 - percent / 100);
//     return discountPrice;
//   }
// };

// // 테스트
// console.log(`원가: ${myLaptop.price}`);
// console.log(`10% 할인가: ${myLaptop.calculateDiscount(10)}`);


// ---------------------------------------------------------
// 미션 3: Interface를 Type Alias로 바꿔보기
// ---------------------------------------------------------
// 위에서 만든 interface Product를 주석 처리하고,
// 아래에 type 키워드를 사용해 똑같은 구조를 만들어보세요.


type ProductType = {
  name: string;
  price: number;
  inStock: boolean;
  manufacturer?: string;
  calculateDiscount: (percent: number) => number;
};


// 질문: interface와 type으로 정의했을 때, 객체를 만드는 방식이 달라지나요?
// 정답: 아니요! 사용하는 쪽(객체 생성) 코드는 100% 똑같습니다.
// -> 이것이 바로 TS의 유연함입니다. 하지만 '확장' 할 때는 문법이 다릅니다.

// [심화 질문]
// 만약 ProductType을 상속받아 'ElectronicProduct'를 만든다면?
// interface는 extends를 쓰고, type은 &(intersection)을 씁니다.
// 이 부분은 코드로 치면서 눈으로 확인만 해보세요.

type ElectronicProduct = Product /* & { voltage: number } */; // Type 방식
interface ElectronicInterface extends Product { voltage: number } // Interface 방식