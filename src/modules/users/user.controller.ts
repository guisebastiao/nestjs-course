import { UpdateUserDTO } from "@/modules/users/dto/update-user.dto";
import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { AuthUser } from "@/common/decorators/auth-user.decorator";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { SuccessResponse } from "@/common/dto/success-response";
import { Public } from "@/common/decorators/auth.decorator";
import { UserService } from "@/modules/users/user.service";
import { type Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
} from "@nestjs/common";

@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post("/register")
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Req() req: Request, @Body() dto: CreateUserDTO) {
    const data = await this.userService.createUser(req, dto);
    return SuccessResponse.of(data);
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  me(@AuthUser() user: UserEntity) {
    const data = this.userService.me(user);
    return SuccessResponse.of(data);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateUser(@AuthUser() user: UserEntity, @Body() dto: UpdateUserDTO) {
    const data = await this.userService.updateUser(user, dto);
    return SuccessResponse.of(data);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteUser(@AuthUser() user: UserEntity) {
    await this.userService.deleteUser(user);
    return SuccessResponse.of();
  }
}
