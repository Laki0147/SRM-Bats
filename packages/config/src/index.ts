export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 30000,
  },
  auth: {
    tokenKey: 'srm_bats_token',
    refreshTokenKey: 'srm_bats_refresh_token',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  product: {
    defaultImage: '/images/placeholder-product.jpg',
  },
};

export type Config = typeof config;
