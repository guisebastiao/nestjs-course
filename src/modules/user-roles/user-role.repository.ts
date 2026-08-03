import { UserRoleEntity } from "@/modules/user-roles/user-role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRoleRepository {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly repository: Repository<UserRoleEntity>,
  ) {}

  async save(userRole: DeepPartial<UserRoleEntity>): Promise<UserRoleEntity> {
    return await this.repository.save(userRole);
  }

  async findByUserAndRole(userId: string, roleId: string): Promise<UserRoleEntity | null> {
    return await this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
        role: {
          id: roleId,
        },
      },
    });
  }

  async delete(userRole: UserRoleEntity): Promise<void> {
    await this.repository.delete(userRole.id);
  }
}
