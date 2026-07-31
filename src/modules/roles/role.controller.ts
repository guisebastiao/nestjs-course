import { CreateRoleDTO } from "@/modules/roles/dto/create-role.dto";
import { UpdateRoleDTO } from "@/modules/roles/dto/update-role.dto";
import { DefaultRoleName } from "@/common/types/default-role-names";
import { HasRoles } from "@/common/decorators/has-roles.decorator";
import { SuccessResponse } from "@/common/dto/success-response";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { RoleService } from "@/modules/roles/role.service";
import { ListResponse } from "@/common/dto/list-response";
import type { Request } from "express";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";

@Controller("/roles")
@HasRoles(DefaultRoleName.ADMIN)
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() createRoleDto: CreateRoleDTO) {
    const data = await this.rolesService.create(req, createRoleDto);
    return SuccessResponse.of(data);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() paginationQuery: PaginationQuery) {
    const { roles, pagination } = await this.rolesService.findAll(paginationQuery);
    const data = ListResponse.of(roles, pagination);
    return SuccessResponse.of(data);
  }

  @Patch("/:roleId")
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() req: Request,
    @Param("roleId") roleId: string,
    @Body() updateRoleDto: UpdateRoleDTO,
  ) {
    const data = await this.rolesService.update(req, roleId, updateRoleDto);
    return SuccessResponse.of(data);
  }

  @Delete("/:roleId")
  @HttpCode(HttpStatus.OK)
  async remove(@Req() req: Request, @Param("roleId") roleId: string) {
    await this.rolesService.delete(req, roleId);
    return SuccessResponse.of();
  }
}
