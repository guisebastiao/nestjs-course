import { randomBytes } from "crypto";

export const generateSku = (prefix = "PRD"): string => {
  return `${prefix}-${randomBytes(3).toString("hex").toUpperCase()}`;
};
