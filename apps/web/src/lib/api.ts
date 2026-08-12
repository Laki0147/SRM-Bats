/**
 * Centralized API client with JWT auth support
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/** Turn a stored relative image path (`/uploads/x.jpg`) into an absolute URL. */
export function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (/^https?:\/\//.test(url) || url.startsWith('data:')) return url;
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
  return url;
}

// Token storage helpers
export const tokenStorage = {
  getAccess: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('srm_access_token');
  },
  getRefresh: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('srm_refresh_token');
  },
  set: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('srm_access_token', accessToken);
    localStorage.setItem('srm_refresh_token', refreshToken);
  },
  clear: () => {
    localStorage.removeItem('srm_access_token');
    localStorage.removeItem('srm_refresh_token');
  },
};

let isRefreshing = false;
let refreshCallbacks: Array<(token: string) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    tokenStorage.clear();
    return null;
  }

  const data = await res.json();
  tokenStorage.set(data.accessToken, data.refreshToken);
  return data.accessToken;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = tokenStorage.getAccess();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && tokenStorage.getRefresh()) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      refreshCallbacks.forEach((cb) => cb(newToken || ''));
      refreshCallbacks = [];

      if (newToken) {
        return apiFetch(path, options); // retry
      }
    } else {
      return new Promise((resolve) => {
        refreshCallbacks.push((token) => {
          headers['Authorization'] = `Bearer ${token}`;
          resolve(fetch(`${API_URL}${path}`, { ...options, headers }));
        });
      });
    }
  }

  return res;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    tokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        Array.isArray(err.message) ? err.message[0] : err.message || 'Registration failed'
      );
    }
    const data = await res.json();
    tokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  },

  logout: () => {
    tokenStorage.clear();
  },

  getProfile: async () => {
    const res = await apiFetch('/auth/profile');
    if (!res.ok) return null;
    return res.json();
  },
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  fetchAll: async (query: Record<string, string | number | boolean> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => v !== undefined && params.set(k, String(v)));
    const res = await fetch(`${API_URL}/products?${params.toString()}`, {
      next: { revalidate: 60 },
    } as RequestInit);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  fetchOne: async (slug: string) => {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    } as RequestInit);
    if (!res.ok) throw new Error(`Product '${slug}' not found`);
    return res.json();
  },

  fetchFeatured: async () => {
    const res = await fetch(`${API_URL}/products/featured`, {
      next: { revalidate: 60 },
    } as RequestInit);
    if (!res.ok) throw new Error('Failed to fetch featured products');
    return res.json();
  },
};

// ─── Cart ────────────────────────────────────────────────────────────────────
export const cartApi = {
  getCart: async () => {
    const res = await apiFetch('/cart');
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  },

  addItem: async (productId: string, quantity: number) => {
    const res = await apiFetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to add to cart');
    }
    return res.json();
  },

  updateItem: async (itemId: string, quantity: number) => {
    const res = await apiFetch(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update cart');
    }
    return res.json();
  },

  removeItem: async (itemId: string) => {
    const res = await apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove item');
    return res.json();
  },

  clearCart: async () => {
    const res = await apiFetch('/cart', { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear cart');
    return res.json();
  },
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: async (data: any) => {
    const res = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(
        Array.isArray(err.message) ? err.message[0] : err.message || 'Failed to create order'
      );
    }
    return res.json();
  },

  list: async () => {
    const res = await apiFetch('/orders');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  get: async (id: string) => {
    const res = await apiFetch(`/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  getByNumber: async (orderNumber: string) => {
    const res = await apiFetch(`/orders/number/${orderNumber}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },
};

// ─── Addresses ────────────────────────────────────────────────────────────────
export const addressesApi = {
  list: async () => {
    const res = await apiFetch('/addresses');
    if (!res.ok) throw new Error('Failed to fetch addresses');
    return res.json();
  },

  create: async (data: any) => {
    const res = await apiFetch('/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to save address');
    }
    return res.json();
  },

  update: async (id: string, data: any) => {
    const res = await apiFetch(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update address');
    }
    return res.json();
  },

  delete: async (id: string) => {
    const res = await apiFetch(`/addresses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete address');
    return res.json();
  },

  setDefault: async (id: string) => {
    const res = await apiFetch(`/addresses/${id}/default`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to set default address');
    return res.json();
  },
};

// ─── Payment ─────────────────────────────────────────────────────────────────
export const paymentApi = {
  createOrder: async (amount: number) => {
    const res = await apiFetch('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create payment order');
    }
    return res.json();
  },

  verify: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const res = await apiFetch('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Payment verification failed');
    }
    return res.json();
  },
};

// ─── Admin helpers ─────────────────────────────────────────────────────────────

/** Reads a JSON error message from a failed Response, tolerating array messages. */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const err = await res.json();
    if (Array.isArray(err.message)) return err.message[0];
    return err.message || fallback;
  } catch {
    return fallback;
  }
}

function toQuery(query: Record<string, string | number | boolean | undefined> = {}): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : '';
}

// ─── Upload (multipart) ────────────────────────────────────────────────────────
export const uploadApi = {
  // Sends FormData WITHOUT a JSON content-type so the browser sets the
  // multipart boundary. Handles a single 401→refresh retry inline.
  image: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);

    const doFetch = (token: string | null) =>
      fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

    let res = await doFetch(tokenStorage.getAccess());
    if (res.status === 401 && tokenStorage.getRefresh()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) res = await doFetch(refreshed);
    }
    if (!res.ok) throw new Error(await readError(res, 'Image upload failed'));
    return res.json();
  },
};

// ─── Admin products (role-guarded server-side) ──────────────────────────────────
export const adminProductsApi = {
  list: async (query: Record<string, string | number | boolean | undefined> = {}) => {
    const res = await apiFetch(`/products/admin/all${toQuery(query)}`);
    if (!res.ok) throw new Error(await readError(res, 'Failed to load products'));
    return res.json();
  },

  get: async (slug: string) => {
    const res = await apiFetch(`/products/admin/detail/${slug}`);
    if (!res.ok) throw new Error(await readError(res, 'Product not found'));
    return res.json();
  },

  create: async (data: any) => {
    const res = await apiFetch('/products', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to create product'));
    return res.json();
  },

  update: async (slug: string, data: any) => {
    const res = await apiFetch(`/products/${slug}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update product'));
    return res.json();
  },

  remove: async (slug: string) => {
    const res = await apiFetch(`/products/${slug}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await readError(res, 'Failed to delete product'));
    return res.json();
  },
};

// ─── Admin orders ────────────────────────────────────────────────────────────
export const adminOrdersApi = {
  list: async (query: Record<string, string | number | boolean | undefined> = {}) => {
    const res = await apiFetch(`/orders/admin/all${toQuery(query)}`);
    if (!res.ok) throw new Error(await readError(res, 'Failed to load orders'));
    return res.json();
  },

  get: async (id: string) => {
    const res = await apiFetch(`/orders/admin/${id}`);
    if (!res.ok) throw new Error(await readError(res, 'Order not found'));
    return res.json();
  },

  updateStatus: async (id: string, status: string) => {
    const res = await apiFetch(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update status'));
    return res.json();
  },
};

// ─── Coupons ───────────────────────────────────────────────────────────────────
export const couponsApi = {
  list: async () => {
    const res = await apiFetch('/coupons');
    if (!res.ok) throw new Error(await readError(res, 'Failed to load coupons'));
    return res.json();
  },

  create: async (data: any) => {
    const res = await apiFetch('/coupons', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to create coupon'));
    return res.json();
  },

  update: async (id: string, data: any) => {
    const res = await apiFetch(`/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update coupon'));
    return res.json();
  },

  remove: async (id: string) => {
    const res = await apiFetch(`/coupons/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await readError(res, 'Failed to delete coupon'));
    return res.json();
  },
};

// ─── Banners ───────────────────────────────────────────────────────────────────
export const bannersApi = {
  list: async () => {
    const res = await apiFetch('/banners');
    if (!res.ok) throw new Error(await readError(res, 'Failed to load banners'));
    return res.json();
  },

  create: async (data: any) => {
    const res = await apiFetch('/banners', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to create banner'));
    return res.json();
  },

  update: async (id: string, data: any) => {
    const res = await apiFetch(`/banners/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to update banner'));
    return res.json();
  },

  remove: async (id: string) => {
    const res = await apiFetch(`/banners/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await readError(res, 'Failed to delete banner'));
    return res.json();
  },
};

// ─── Categories & Brands ────────────────────────────────────────────────────────
export const categoriesApi = {
  list: async () => {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' } as RequestInit);
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  create: async (data: any) => {
    const res = await apiFetch('/categories', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to create category'));
    return res.json();
  },
};

export const brandsApi = {
  list: async () => {
    const res = await fetch(`${API_URL}/brands`, { cache: 'no-store' } as RequestInit);
    if (!res.ok) throw new Error('Failed to load brands');
    return res.json();
  },

  create: async (data: any) => {
    const res = await apiFetch('/brands', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw new Error(await readError(res, 'Failed to create brand'));
    return res.json();
  },
};
