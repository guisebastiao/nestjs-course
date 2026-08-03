import { UserRoleEntity } from "@/modules/user-roles/user-role.entity";
import { UserRoleController } from "@/modules/user-roles/user-role.controller";
import { UserRoleRepository } from "@/modules/user-roles/user-role.repository";
import { UserRoleService } from "@/modules/user-roles/user-role.service";
import { RoleModule } from "@/modules/roles/role.module";
import { UserModule } from "@/modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleEntity]), UserModule, RoleModule],
  controllers: [UserRoleController],
  providers: [UserRoleService, UserRoleRepository],
  exports: [UserRoleRepository],
})
export class UserRoleModule {}
