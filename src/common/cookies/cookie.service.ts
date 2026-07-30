import { CookieOptions, Request, Response } from "express";
import { CookieName } from "@/common/types/cookie-names";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CookieService {
  private static readonly DEFAULT_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 10;

  constructor(private readonly configService: ConfigService) {}

  set(response: Response, name: CookieName, value: string, options: CookieOptions = {}): void {
    const defaults: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      maxAge: CookieService.DEFAULT_MAX_AGE,
      sameSite: "lax",
      path: "/",
    };

    response.cookie(name, value, {
      ...defaults,
      ...options,
    });
  }

  get(request: Request, name: CookieName): string | undefined {
    return request.cookies?.[name] as string | undefined;
  }

  getAll(request: Request, names: readonly CookieName[]): Partial<Record<CookieName, string>> {
    return names.reduce(
      (cookies, name) => {
        const value = request.cookies?.[name];

        if (value !== undefined) {
          cookies[name] = value;
        }

        return cookies;
      },
      {} as Partial<Record<CookieName, string>>,
    );
  }

  clear(response: Response, names: CookieName[], options: CookieOptions = {}): void {
    names.forEach((name) => {
      response.clearCookie(name, {
        path: "/",
        ...options,
      });
    });
  }
}
