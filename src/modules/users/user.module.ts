import { UserController } from "@/modules/users/user.controller";
import { UserRepository } from "@/modules/users/user.repository";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { UserService } from "@/modules/users/user.service";
import { UserEntity } from "@/modules/users/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), BcryptModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
