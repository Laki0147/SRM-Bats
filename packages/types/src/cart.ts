export interface Cart {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: string;
    name: string;
    price: number;
    images?: Array<{ url: string; alt?: string }>;
  };
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}
