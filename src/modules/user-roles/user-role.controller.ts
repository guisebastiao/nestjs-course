import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { AssignRoleDTO } from "@/modules/user-roles/dto/assign-role.dto";
import { UserRoleService } from "@/modules/user-roles/user-role.service";
import { DefaultRoleName } from "@/common/types/default-role-names";
import { HasRoles } from "@/common/decorators/has-roles.decorator";
import { SuccessResponse } from "@/common/dto/success-response";
import type { Request } from "express";

@Controller("/users")
@HasRoles(DefaultRoleName.ADMIN)
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post("/:userId/roles")
  async assignRole(
    @Req() req: Request,
    @Param("userId") userId: string,
    @Body() dto: AssignRoleDTO,
  ) {
    await this.userRoleService.assign(req, userId, dto);
    return SuccessResponse.of();
  }

  @Get("/:userId/roles")
  async findRoles(@Req() req: Request, @Param("userId") userId: string) {
    const data = await this.userRoleService.findByUser(req, userId);
    return SuccessResponse.of(data);
  }

  @Delete("/:userId/roles/:roleId")
  async removeRole(
    @Req() req: Request,
    @Param("userId") userId: string,
    @Param("roleId") roleId: string,
  ) {
    await this.userRoleService.removeRole(req, userId, roleId);
    return SuccessResponse.of();
  }
}
