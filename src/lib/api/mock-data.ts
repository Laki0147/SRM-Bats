import {
  Product,
  Category,
  Cart,
  Wishlist,
  Order,
  Review,
  User,
} from './types';

/**
 * Mock Data Generators for Development
 */

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Cricket Bats',
    slug: 'cricket-bats',
    description: 'Professional cricket bats for all levels',
    image: '/images/categories/cricket-bats.jpg',
    productCount: 45,
  },
  {
    id: '2',
    name: 'Batting Gloves',
    slug: 'batting-gloves',
    description: 'High-quality batting gloves',
    image: '/images/categories/gloves.jpg',
    productCount: 32,
  },
  {
    id: '3',
    name: 'Batting Pads',
    slug: 'batting-pads',
    description: 'Protective batting pads',
    image: '/images/categories/pads.jpg',
    productCount: 28,
  },
  {
    id: '4',
    name: 'Helmets',
    slug: 'helmets',
    description: 'Safety helmets for cricket',
    image: '/images/categories/helmets.jpg',
    productCount: 18,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'SRM Elite Pro Cricket Bat',
    slug: 'srm-elite-pro-cricket-bat',
    description:
      'Professional grade English willow cricket bat with excellent balance and power',
    price: 12999,
    compareAtPrice: 15999,
    images: [
      {
        id: '1',
        url: '/images/products/bat-1.jpg',
        alt: 'SRM Elite Pro Cricket Bat',
        isPrimary: true,
      },
      {
        id: '2',
        url: '/images/products/bat-1-side.jpg',
        alt: 'SRM Elite Pro Cricket Bat Side View',
        isPrimary: false,
      },
    ],
    category: mockCategories[0],
    variants: [
      {
        id: '1',
        name: 'Short Handle',
        price: 12999,
        inStock: true,
        attributes: { handle: 'short', weight: '1.2kg' },
      },
      {
        id: '2',
        name: 'Long Handle',
        price: 12999,
        inStock: true,
        attributes: { handle: 'long', weight: '1.25kg' },
      },
    ],
    specifications: [
      { name: 'Willow Grade', value: 'Grade 1 English Willow' },
      { name: 'Handle', value: 'Cane Handle with Rubber Grip' },
      { name: 'Weight', value: '1.2kg - 1.25kg' },
      { name: 'Size', value: 'Full Size' },
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 127,
    tags: ['english-willow', 'professional', 'elite'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'SRM Pro Batting Gloves',
    slug: 'srm-pro-batting-gloves',
    description: 'Premium leather batting gloves with superior grip and protection',
    price: 2499,
    compareAtPrice: 2999,
    images: [
      {
        id: '3',
        url: '/images/products/gloves-1.jpg',
        alt: 'SRM Pro Batting Gloves',
        isPrimary: true,
      },
    ],
    category: mockCategories[1],
    variants: [
      {
        id: '3',
        name: 'Medium',
        price: 2499,
        inStock: true,
        attributes: { size: 'M' },
      },
      {
        id: '4',
        name: 'Large',
        price: 2499,
        inStock: true,
        attributes: { size: 'L' },
      },
    ],
    specifications: [
      { name: 'Material', value: 'Premium Leather' },
      { name: 'Protection', value: 'High-Density Foam' },
      { name: 'Grip', value: 'Anti-Slip Palm' },
    ],
    inStock: true,
    stockQuantity: 30,
    rating: 4.6,
    reviewCount: 89,
    tags: ['leather', 'professional', 'grip'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
];

export const mockCart: Cart = {
  id: 'cart-1',
  items: [
    {
      id: 'item-1',
      product: mockProducts[0],
      variant: mockProducts[0].variants[0],
      quantity: 1,
      price: 12999,
      total: 12999,
    },
  ],
  subtotal: 12999,
  tax: 1299,
  shipping: 0,
  total: 14298,
  updatedAt: '2024-01-20T10:00:00Z',
};

export const mockWishlist: Wishlist = {
  id: 'wishlist-1',
  items: [
    {
      id: 'wish-1',
      product: mockProducts[1],
      addedAt: '2024-01-15T10:00:00Z',
    },
  ],
  updatedAt: '2024-01-15T10:00:00Z',
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    status: 'delivered',
    items: [
      {
        id: 'order-item-1',
        product: mockProducts[0],
        variant: mockProducts[0].variants[0],
        quantity: 1,
        price: 12999,
        total: 12999,
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Cricket Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      phone: '+91 9876543210',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Cricket Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      phone: '+91 9876543210',
    },
    subtotal: 12999,
    tax: 1299,
    shipping: 0,
    total: 14298,
    paymentMethod: 'card',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T15:00:00Z',
  },
];

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    productId: '1',
    userId: 'user-1',
    userName: 'Rajesh Kumar',
    rating: 5,
    title: 'Excellent bat!',
    comment:
      'This bat has amazing balance and power. Highly recommend for serious players.',
    verified: true,
    helpful: 15,
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'review-2',
    productId: '1',
    userId: 'user-2',
    userName: 'Amit Sharma',
    rating: 4,
    title: 'Great quality',
    comment: 'Very good bat, but a bit heavy for my preference.',
    verified: true,
    helpful: 8,
    createdAt: '2024-01-16T14:30:00Z',
  },
];

export const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+91 9876543210',
  avatar: '/images/avatars/default.jpg',
  createdAt: '2024-01-01T00:00:00Z',
};
