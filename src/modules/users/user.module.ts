import { UserEntity } from "@/modules/users/entities/user.entity";
import { UserController } from "@/modules/users/user.controller";
import { UserRepository } from "@/modules/users/user.repository";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { UserService } from "@/modules/users/user.service";
import { UserMapper } from "@/modules/users/user.mapper";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), BcryptModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserMapper],
  exports: [UserRepository],
})
export class UserModule {}
