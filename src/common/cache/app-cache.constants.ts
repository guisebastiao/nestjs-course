export const CACHE = {
  PRODUCT: {
    PRODUCT_CACHE_PREFIX: "product:",
    PRODUCT_LIST_CACHE_PREFIX: "products:",
    PRODUCT_CACHE_TTL_MS: 5 * 60 * 1000,
  },
} as const;

export const APP_CACHE = Symbol("APP_CACHE");
