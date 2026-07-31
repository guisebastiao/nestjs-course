import { DefaultRoleName } from "@/common/types/default-role-names";
import { RoleEntity } from "@/modules/roles/entities/role.entity";
import { RoleRepository } from "@/modules/roles/role.repository";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class RoleGenerator implements OnModuleInit {
  constructor(private readonly roleRepository: RoleRepository) {}

  async onModuleInit(): Promise<void> {
    await this.generate();
  }

  async generate(): Promise<void> {
    const names = Object.values(DefaultRoleName);

    const existing = await this.roleRepository.existsByNames(names);

    const existingNames = new Set(existing.map((role) => role.name));

    const roles = names
      .filter((name) => !existingNames.has(name))
      .map((name) => {
        const role = new RoleEntity();
        role.name = name;
        return role;
      });

    if (roles.length > 0) {
      await this.roleRepository.saveAll(roles);
    }
  }
}
