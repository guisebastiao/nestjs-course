export const CACHE = {
  PRODUCT: {
    PRODUCT_CACHE_PREFIX: "product:",
    PRODUCT_LIST_CACHE_PREFIX: "products:",
    PRODUCT_CACHE_TTL_MS: 5 * 60 * 1000,
  },
  USER: {
    USER_CACHE_PREFIX: "user:",
    USER_LIST_CACHE_PREFIX: "users:",
    USER_CACHE_TTL_MS: 5 * 60 * 1000,
  },
} as const;

export const APP_CACHE = Symbol("APP_CACHE");
