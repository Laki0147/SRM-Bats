const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category: Category;
  images: ProductImage[];
  specifications: ProductSpec[];
  variants?: ProductVariant[];
  reviews?: Review[];
  _count?: { reviews: number };
  createdAt: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsQuery {
  search?: string;
  category?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function fetchProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);
  if (query.featured !== undefined) params.set('featured', String(query.featured));
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.sortOrder) params.set('sortOrder', query.sortOrder);

  const res = await fetch(`${API_URL}/products?${params}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProduct(slug: string): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Product '${slug}' not found`);
  return res.json();
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products/featured`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch featured products');
  return res.json();
}
