import { Controller, Get, Post, Body, Delete, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { UploadUserPictureDTO } from "@/modules/user-picture/dto/upload-user-picture.dto";
import { UserPictureService } from "@/modules/user-picture/user-picture.service";
import { AuthUser } from "@/common/decorators/auth-user.decorator";
import { SuccessResponse } from "@/common/dto/success-response";
import { UserEntity } from "@/modules/users/user.entity";
import type { Request } from "express";

@Controller("/pictures")
export class UserPictureController {
  constructor(private readonly userPictureService: UserPictureService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @Req() req: Request,
    @AuthUser() user: UserEntity,
    @Body() uploadUserPictureDto: UploadUserPictureDTO,
  ) {
    const data = await this.userPictureService.upload(req, user.id, uploadUserPictureDto);
    return SuccessResponse.of(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findByUser(@Req() req: Request, @AuthUser() user: UserEntity) {
    const data = await this.userPictureService.findByUser(req, user.id);
    return SuccessResponse.of(data);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @AuthUser() user: UserEntity) {
    await this.userPictureService.delete(req, user.id);
    return SuccessResponse.of();
  }
}
