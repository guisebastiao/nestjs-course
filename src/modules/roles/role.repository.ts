import { RoleEntity } from "@/modules/roles/role.entity";
import { DeepPartial, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  async save(role: DeepPartial<RoleEntity>): Promise<RoleEntity> {
    return await this.repository.save(role);
  }

  async saveAll(roles: DeepPartial<RoleEntity>[]): Promise<RoleEntity[]> {
    return await this.repository.save(roles);
  }

  async existsByName(name: string): Promise<boolean> {
    return await this.repository.existsBy({ name });
  }

  async existsByNames(names: string[]): Promise<RoleEntity[]> {
    return await this.repository.findBy({ name: In(names) });
  }

  async existsUserIntoRole(roleId: string): Promise<boolean> {
    return await this.repository.existsBy({
      id: roleId,
      userRoles: {
        role: {
          id: roleId,
        },
      },
    });
  }

  async findById(id: string): Promise<RoleEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return await this.repository.findOneBy({ name });
  }

  async findAllByUser(userId: string): Promise<RoleEntity[]> {
    return await this.repository.find({
      where: {
        userRoles: {
          user: {
            id: userId,
          },
        },
      },
      order: {
        name: "ASC",
      },
    });
  }

  async findAllRoles(page: number, limit: number): Promise<[RoleEntity[], number]> {
    const skip = (page - 1) * limit;

    return await this.repository.findAndCount({
      order: {
        name: "ASC",
      },
      take: limit,
      skip,
    });
  }

  async delete(role: RoleEntity): Promise<void> {
    await this.repository.delete({
      id: role.id,
    });
  }
}
