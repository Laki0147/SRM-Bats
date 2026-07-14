# SRM Bats API Integration Layer

Complete TypeScript API client for the SRM Bats e-commerce platform with Next.js support.

## Features

- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust error handling with retry logic
- **Caching**: Built-in caching with TTL support
- **Request Cancellation**: Cancel pending requests when needed
- **Authentication**: Automatic token management
- **Interceptors**: Request/response interceptors for auth and error handling
- **Mock Data**: Development mock data generators
- **React Hooks**: Custom hooks for easy integration
- **Testing**: Comprehensive test utilities

## Installation

```bash
npm install axios
# or
yarn add axios
```

## Usage

### Basic Usage

```typescript
import { api } from '@/lib/api';

// Get products
const products = await api.products.getProducts({
  category: 'cricket-bats',
  page: 1,
  limit: 20,
});

// Get product by ID
const product = await api.products.getProductById('123');

// Add to cart
const cart = await api.cart.addToCart({
  productId: '123',
  quantity: 1,
});

// Create order
const order = await api.orders.createOrder({
  items: cart.items,
  shippingAddress: address,
  billingAddress: address,
  paymentMethod: 'card',
  paymentToken: 'token',
});
```

### With React Hooks

```typescript
import { useApi, useMutation } from '@/lib/api/hooks';
import { api } from '@/lib/api';

function ProductList() {
  const { data, loading, error, refetch } = useApi(
    () => api.products.getProducts({ page: 1, limit: 20 }),
    []
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

function AddToCartButton({ productId }: { productId: string }) {
  const { mutate, loading } = useMutation(
    (quantity: number) =>
      api.cart.addToCart({ productId, quantity })
  );

  const handleClick = async () => {
    try {
      await mutate(1);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Request Cancellation

```typescript
import { searchApi, CancelableRequest } from '@/lib/api';

let searchRequest: CancelableRequest<SearchResult> | null = null;

function handleSearch(query: string) {
  // Cancel previous request
  if (searchRequest) {
    searchRequest.cancel();
  }

  // Create new request
  searchRequest = searchApi.search(query);

  searchRequest.promise
    .then((results) => {
      console.log('Search results:', results);
    })
    .catch((error) => {
      if (error.code !== 'ERR_CANCELED') {
        console.error('Search error:', error);
      }
    });
}
```

### Error Handling

```typescript
import { api, isApiError, formatApiError } from '@/lib/api';

try {
  const product = await api.products.getProductById('123');
} catch (error) {
  if (isApiError(error)) {
    console.error('API Error:', formatApiError(error));
    console.error('Error code:', error.code);
    console.error('Status code:', error.status);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Caching

```typescript
import { cache } from '@/lib/api';

// Manual cache operations
cache.set('key', data, 5 * 60 * 1000); // Cache for 5 minutes
const cachedData = cache.get('key');

// Clear specific cache
cache.delete('key');

// Clear cache by pattern
cache.deletePattern('products:*');

// Clear all cache
cache.clear();
```

## API Endpoints

### Products

- `getProducts(filters?)` - Get paginated products
- `getProductById(id)` - Get product by ID
- `getProductBySlug(slug)` - Get product by slug
- `getFeaturedProducts()` - Get featured products
- `getRelatedProducts(id)` - Get related products
- `searchProducts(query, filters?)` - Search products (cancelable)

### Categories

- `getCategories()` - Get all categories
- `getCategoryBySlug(slug)` - Get category by slug
- `getCategoryProducts(slug, page, limit)` - Get products by category

### Cart

- `getCart()` - Get current cart
- `addToCart(request)` - Add item to cart
- `updateCartItem(request)` - Update cart item quantity
- `removeFromCart(itemId)` - Remove item from cart
- `clearCart()` - Clear cart

### Wishlist

- `getWishlist()` - Get user's wishlist
- `addToWishlist(productId)` - Add product to wishlist
- `removeFromWishlist(productId)` - Remove product from wishlist
- `isInWishlist(productId)` - Check if product is in wishlist

### Orders

- `createOrder(request)` - Create new order
- `getOrderById(id)` - Get order by ID
- `getOrderHistory(page, limit)` - Get order history
- `cancelOrder(id)` - Cancel order
- `trackOrder(orderNumber)` - Track order

### Reviews

- `getProductReviews(productId, page, limit)` - Get product reviews
- `createReview(request)` - Create a review
- `markReviewHelpful(reviewId)` - Mark review as helpful
- `reportReview(reviewId, reason)` - Report review

### Search

- `search(query)` - Search products and categories (cancelable)
- `getSuggestions(query)` - Get search suggestions
- `getPopularSearches()` - Get popular searches

### Auth

- `login(request)` - Login user
- `register(request)` - Register new user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user
- `refreshToken()` - Refresh auth token
- `requestPasswordReset(email)` - Request password reset
- `resetPassword(token, password)` - Reset password

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.srmbats.com
```

## Mock Data

For development, use the provided mock 

```typescript
import {
  mockProducts,
  mockCategories,
  mockCart,
  mockWishlist,
  mockOrders,
  mockReviews,
  mockUser,
} from '@/lib/api/mock-data';
```

## Testing

Run tests:

```bash
npm test
# or
yarn test
```

## Type Definitions

All types are exported from `@/lib/api/types`:

```typescript
import type {
  Product,
  Category,
  Cart,
  Order,
  Review,
  User,
  ApiResponse,
  ApiError,
  // ... and more
} from '@/lib/api/types';
```

## Contributing

When adding new endpoints:

1. Add types to `types.ts`
2. Create endpoint file in `endpoints/`
3. Export from `index.ts`
4. Add tests in `__tests__/`
5. Update this README

## License

MIT
