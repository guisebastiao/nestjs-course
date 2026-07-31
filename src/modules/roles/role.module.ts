import { RoleGenerator } from "@/modules/roles/generators/role.generator";
import { RoleEntity } from "@/modules/roles/entities/role.entity";
import { RoleRepository } from "@/modules/roles/role.repository";
import { RoleController } from "@/modules/roles/role.controller";
import { RoleService } from "@/modules/roles/role.service";
import { RoleMapper } from "@/modules/roles/role.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, RoleMapper, RoleGenerator],
  exports: [RoleRepository, RoleMapper],
})
export class RoleModule {}
