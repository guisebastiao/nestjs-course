export type TokenPayload = {
  sub: string;
  exp: number;
  iat: number;
  type: "access" | "refresh";
};
