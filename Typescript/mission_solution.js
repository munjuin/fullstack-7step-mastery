"use strict";
// // [Part 1 - 5단계 정답 예시]
// // 꼭 혼자 먼저 작성해보고 비교해 보세요!
// // 1. Product 타입 정의
// // 객체의 구조를 정의하므로 interface를 사용했습니다. (type도 가능)
// interface Product {
//     name: string;
//     price: number;
//     inStock: boolean;
//     manufacturer?: string; // 선택적 속성 (Optional Property)
// }
// // 2. 상품 목록 배열 생성
// const products: Product[] = [
//     {
//         name: "기계식 키보드",
//         price: 120000,
//         inStock: true,
//         manufacturer: "Keychron"
//     },
//     {
//         name: "무선 마우스",
//         price: 50000,
//         inStock: false, // 재고 없음
//         manufacturer: "Logitech"
//     },
//     {
//         name: "모니터 받침대",
//         price: 15000,
//         inStock: true
//         // manufacturer 속성이 없어도 에러가 나지 않음 (Optional)
//     }
// ];
// // 3. 함수 구현
// function printAvailableProducts(items: Product[]): void {
//     // 반환값이 없으므로 void 타입 지정
//     // 방법 1: forEach 사용
//     items.forEach((item) => {
//         if (item.inStock) {
//             console.log(`${item.name}: ${item.price}원`);
//         }
//     });
//     /* // 방법 2: filter 사용 (좀 더 모던한 방식)
//     const availableItems = items.filter(item => item.inStock);
//     availableItems.forEach(item => {
//         console.log(`${item.name}: ${item.price}원`);
//     });
//     */
// }
// // 실행 테스트
// printAvailableProducts(products);
