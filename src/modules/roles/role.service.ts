import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDTO } from "@/modules/roles/dto/create-role.dto";
import { UpdateRoleDTO } from "@/modules/roles/dto/update-role.dto";
import { RoleRepository } from "@/modules/roles/role.repository";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { LoggerService } from "@/common/logger/logger.service";
import { RoleMapper } from "@/common/mappers/role.mapper";
import { RoleDTO } from "@/modules/roles/dto/role.dto";
import { Pagination } from "@/common/dto/pagination";
import { Request } from "express";

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly roleMapper: RoleMapper,
    private readonly logger: LoggerService,
  ) {}

  async create(req: Request, dto: CreateRoleDTO): Promise<RoleDTO> {
    const existsRole = await this.roleRepository.existsByName(dto.name);

    if (existsRole) {
      this.logger.warn({
        message: "Create role already exists.",
        path: req.path,
        class: RoleService.name,
        method: this.create.name,
        data: { name: dto.name },
      });

      throw new ConflictException("Role already exists.");
    }

    const entity = this.roleMapper.toEntity(dto);

    const saved = await this.roleRepository.save(entity);

    return this.roleMapper.toResponse(saved);
  }

  async findAll({
    page,
    limit,
  }: PaginationQuery): Promise<{ roles: RoleDTO[]; pagination: Pagination }> {
    const [roles, total] = await this.roleRepository.findAllRoles(page, limit);

    return {
      roles: roles.map((role) => this.roleMapper.toResponse(role)),
      pagination: new Pagination(page, limit, total, Math.ceil(total / limit)),
    };
  }

  async update(req: Request, id: string, dto: UpdateRoleDTO): Promise<RoleDTO> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      this.logger.warn({
        message: "Update role not found.",
        path: req.path,
        class: RoleService.name,
        method: this.update.name,
        data: { roleId: id },
      });

      throw new NotFoundException("Role not found.");
    }

    const updated = this.roleMapper.update(role, dto);

    const saved = await this.roleRepository.save(updated);

    return this.roleMapper.toResponse(saved);
  }

  async delete(req: Request, roleId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      this.logger.warn({
        message: "Delete role not found.",
        path: req.path,
        class: RoleService.name,
        method: this.delete.name,
        data: { roleId },
      });

      throw new NotFoundException("Role not found.");
    }

    const existsUserIntoRole = await this.roleRepository.existsUserIntoRole(role.id);

    if (existsUserIntoRole) {
      this.logger.warn({
        message: "Role deletion blocked because it is assigned to one or more users.",
        path: req.path,
        class: RoleService.name,
        method: this.delete.name,
        data: { roleId },
      });

      throw new ConflictException("Exists users into role, is not possible delete role.");
    }

    await this.roleRepository.delete(role);
  }
}
