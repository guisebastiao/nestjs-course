export const STORAGE = {
  PRODUCT_IMAGES: {
    FIELD_NAME: "images",
    MAX_FILES: 15,
    MAX_FILE_SIZE_MB: 10,
  },
} as const;

export const MINIO_CLIENT = Symbol("MINIO_CLIENT");
