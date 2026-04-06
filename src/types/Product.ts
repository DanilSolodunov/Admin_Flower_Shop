export interface Product {
  id: number;
  image: string;
  description: string;
  price: number;
  amount: number;
  category?: string;
  name?: string;
}

export interface AddToCartRequest {
  image: string;
  description: string;
  price: number;
  amount: number;
  category?: string;
  name?: string;
}