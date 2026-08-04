import { RoleRepository } from "@/modules/roles/role.repository";
import { RoleController } from "@/modules/roles/role.controller";
import { RoleGenerator } from "@/modules/roles/role.generator";
import { RoleService } from "@/modules/roles/role.service";
import { RoleEntity } from "@/modules/roles/role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, RoleGenerator],
  exports: [RoleRepository],
})
export class RoleModule {}
