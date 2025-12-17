

interface Product {
  name: string;
  price: number;
  inStock: boolean;
  manufacturer?: string;
};

let products: Product[] = [
  {name: "노트북", price: 1000000, inStock: true, manufacturer: "삼성"},
  {name: "냉장고", price: 7000000, inStock: false, manufacturer: "엘지"},
  {name: "세탁기", price: 2600000, inStock: true},
]

function printAvailableProducts(products: Product[]){
  products.forEach(product => {
    if(product.inStock === true){
      console.log(product.name);
      console.log(product.price);
    }
  })
}

printAvailableProducts(products);