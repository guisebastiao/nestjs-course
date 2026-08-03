import { UserRoleEntity } from "@/modules/user-roles/user-role.entity";
import { UserRoleRepository } from "@/modules/user-roles/user-role.repository";
import { AssignRoleDTO } from "@/modules/user-roles/dto/assign-role.dto";
import { RoleRepository } from "@/modules/roles/role.repository";
import { UserRepository } from "@/modules/users/user.repository";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { LoggerService } from "@/common/logger/logger.service";
import { RoleMapper } from "@/modules/roles/role.mapper";
import { RoleDTO } from "@/modules/roles/dto/role.dto";
import { Request } from "express";

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly roleMapper: RoleMapper,
    private readonly logger: LoggerService,
  ) {}

  async assign(req: Request, userId: string, dto: AssignRoleDTO): Promise<void> {
    const [user, role, existUserRole] = await Promise.all([
      this.userRepository.findById(userId),
      this.roleRepository.findById(dto.roleId),
      this.userRoleRepository.findByUserAndRole(userId, dto.roleId),
    ]);

    if (!user) {
      this.logger.warn({
        message: "User was not found.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId },
      });

      throw new NotFoundException("User not found.");
    }

    if (!role) {
      this.logger.warn({
        message: "Role was not found.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId },
      });

      throw new NotFoundException("Role not found.");
    }

    if (existUserRole) {
      this.logger.warn({
        message: "The role is already being used by the user.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId, roleId: existUserRole.id },
      });

      throw new ConflictException("This user already has this role.");
    }

    const userRole = new UserRoleEntity();
    userRole.user = user;
    userRole.role = role;

    await this.userRoleRepository.save(userRole);
  }

  async findByUser(req: Request, userId: string): Promise<RoleDTO[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      this.logger.warn({
        message: "User was not found.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId },
      });

      throw new NotFoundException("User not found.");
    }

    const roles = await this.roleRepository.findAllByUser(user.id);
    return roles.map((role) => this.roleMapper.toResponse(role));
  }

  async removeRole(req: Request, userId: string, roleId: string): Promise<void> {
    const [user, role, userRole] = await Promise.all([
      this.userRepository.findById(userId),
      this.roleRepository.findById(roleId),
      this.userRoleRepository.findByUserAndRole(userId, roleId),
    ]);

    if (!user) {
      this.logger.warn({
        message: "User was not found.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId },
      });

      throw new NotFoundException("User not found.");
    }

    if (!role) {
      this.logger.warn({
        message: "Role was not found.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId },
      });

      throw new NotFoundException("Role not found.");
    }

    if (!userRole) {
      this.logger.warn({
        message: "User role was not found.",
        path: req.path,
        class: UserRoleService.name,
        method: this.assign.name,
        data: { userId },
      });

      throw new NotFoundException("This user does not have this role.");
    }

    await this.userRoleRepository.delete(userRole);
  }
}
