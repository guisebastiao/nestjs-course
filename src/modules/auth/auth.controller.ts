import { Controller, Post, Body, HttpCode, HttpStatus, Req, Res } from "@nestjs/common";
import { SuccessResponse } from "@/common/dto/success-response";
import { CookieService } from "@/common/cookies/cookie.service";
import { Public } from "@/common/decorators/auth.decorator";
import { AuthService } from "@/modules/auth/auth.service";
import { CookieName } from "@/common/types/cookie-names";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import type { Response, Request } from "express";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Public()
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(req, dto);

    this.cookieService.set(res, CookieName.ACCESS_TOKEN, accessToken);
    this.cookieService.set(res, CookieName.REFRESH_TOKEN, refreshToken);

    return SuccessResponse.of();
  }
}
