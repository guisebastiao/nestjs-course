import { Controller, Post, Body, HttpStatus, HttpCode, Req, Res } from "@nestjs/common";
import { RefreshService } from "@/modules/refreshes/refresh.service";
import { SuccessResponse } from "@/common/dto/success-response";
import { CookieService } from "@/common/cookies/cookie.service";
import { Public } from "@/common/decorators/auth.decorator";
import { CookieName } from "@/common/types/cookie-names";
import type { Response, Request } from "express";

@Controller("/refresh")
export class RefreshController {
  constructor(
    private readonly refreshService: RefreshService,
    private readonly cookieService: CookieService,
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.OK)
  async create(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { access_token, refresh_token } = this.cookieService.getAll(req, [
      CookieName.ACCESS_TOKEN,
      CookieName.REFRESH_TOKEN,
    ]);

    const { accessToken, refreshToken } = await this.refreshService.refresh(
      req,
      access_token,
      refresh_token,
    );

    this.cookieService.set(res, CookieName.ACCESS_TOKEN, accessToken);
    this.cookieService.set(res, CookieName.REFRESH_TOKEN, refreshToken);

    return SuccessResponse.of();
  }
}
