// [Part 1 - 4단계] 의도적으로 망가뜨리고 고쳐보기
// 이 코드를 작성하면 곳곳에서 빨간 줄이 뜰 겁니다.
// 당황하지 말고 마우스를 올려서 "에러 메시지"를 읽어보세요.

// ---------------------------------------------------------
// 1. 기본 타입 위반 실험
// ---------------------------------------------------------
let experimentName: string = "Kim";

// [실험 1] string 변수에 숫자를 넣어보세요.
// 주석을 풀고 에러 메시지를 확인하세요.
// experimentName = 123;

// -> 예상 에러: Type 'number' is not assignable to type 'string'.
// 해석: 숫자 타입은 문자열 타입에 할당할 수 없어!

// ---------------------------------------------------------
// 2. Union Type과 Narrowing 실험 (중요!)
// ---------------------------------------------------------
function padLeft(padding: number | string, input: string) {
    // [실험 2] 숫자일 수도, 문자일 수도 있는 padding에 바로 연산을 시도해 보세요.
    // return " ".repeat(padding) + input;

    // -> 예상 에러: Argument of type 'string | number' is not assignable to parameter of type 'number'.
    // 해석: repeat 함수는 숫자만 받는데, 너 지금 문자일 수도 있는 값을 넣었어!

    // [해결책] "Narrowing(타입 좁히기)"을 통해 해결해 보세요.
    if (typeof padding === "number") {
        return " ".repeat(padding) + input; // 여기선 padding이 확실히 number
    }
    return padding + input; // 여기선 padding이 확실히 string
}

// ---------------------------------------------------------
// 3. Readonly(읽기 전용) 실험
// ---------------------------------------------------------
type User = {
    readonly id: number; // 바뀌면 안 되는 값
    name: string;
}

let testUser: User = {
    id: 1234,
    name: "Park"
};

// [실험 3] readonly 속성을 억지로 바꾸려고 해보세요.
// testUser.id = 5678;

// -> 예상 에러: Cannot assign to 'id' because it is a read-only property.
// 해석: id는 읽기 전용이라 수정 불가능해!

testUser.name = "Lee"; // 이건 됨

// ---------------------------------------------------------
// 4. Optional Property 실험
// ---------------------------------------------------------
type Product = {
    name: string;
    price?: number; // 가격이 있을 수도 있고 없을 수도 있음
};

function printPrice(product: Product) {
    // [실험 4] price가 없을 수도 있는데(undefined), 마치 무조건 있는 것처럼 써보세요.
    // return product.price.toFixed(2);

    // -> 예상 에러: 'product.price' is possibly 'undefined'.
    // 해석: 야, 가격표 없으면 어떡하려고 그래? (undefined 체크 해줘)

    // [해결책]
    if (product.price) {
        return product.price.toFixed(2);
    }
    return "가격 미정";
}