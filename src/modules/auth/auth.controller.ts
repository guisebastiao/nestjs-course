import { Controller, Post, Body, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { SuccessResponse } from "@/common/dto/success-response";
import { Public } from "@/common/decorators/auth.decorator";
import { AuthService } from "@/modules/auth/auth.service";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import { type Request } from "express";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Body() dto: LoginDto) {
    const data = await this.authService.login(req, dto);
    return SuccessResponse.of(data);
  }
}
