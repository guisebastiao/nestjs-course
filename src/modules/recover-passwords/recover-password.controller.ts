import { CreateRecoverPasswordDTO } from "@/modules/recover-passwords/dto/create-recover-password.dto";
import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, Req } from "@nestjs/common";
import { RecoverPasswordService } from "@/modules/recover-passwords/recover-password.service";
import { ResetPasswordDTO } from "@/modules/recover-passwords/dto/reset-password.dto";
import { RecoverTokenDTO } from "@/modules/recover-passwords/dto/recover-token.dto";
import { SuccessResponse } from "@/common/dto/success-response";
import { Public } from "@/common/decorators/auth.decorator";
import { type Request } from "express";

@Controller("/recover-password")
export class RecoverPasswordController {
  constructor(private readonly recoverPasswordService: RecoverPasswordService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRecoverPassword(@Req() req: Request, @Body() dto: CreateRecoverPasswordDTO) {
    await this.recoverPasswordService.createRecoverPassword(req, dto);
    return SuccessResponse.of();
  }

  @Public()
  @Patch("/:token")
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req: Request,
    @Body() dto: ResetPasswordDTO,
    @Param() { token }: RecoverTokenDTO,
  ) {
    await this.recoverPasswordService.resetPassword(req, dto, token);
    return SuccessResponse.of();
  }
}
