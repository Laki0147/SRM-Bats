/**
 * Centralized API client with JWT auth support
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      throw new Error(Array.isArray(err.message) ? err.message[0] : err.message || 'Registration failed');
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
    const res = await fetch(`${API_URL}/products?${params}`, { next: { revalidate: 60 } } as RequestInit);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  fetchOne: async (slug: string) => {
    const res = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 60 } } as RequestInit);
    if (!res.ok) throw new Error(`Product '${slug}' not found`);
    return res.json();
  },

  fetchFeatured: async () => {
    const res = await fetch(`${API_URL}/products/featured`, { next: { revalidate: 60 } } as RequestInit);
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
      throw new Error(Array.isArray(err.message) ? err.message[0] : err.message || 'Failed to create order');
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

  verify: async (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) => {
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
