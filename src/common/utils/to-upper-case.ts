export const toUpperCase = (value: string): string => {
  return typeof value === "string" ? value.trim().toUpperCase() : value;
};
