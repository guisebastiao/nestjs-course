import { UserPictureController } from "@/modules/user-picture/user-picture.controller";
import { UserPictureRepository } from "@/modules/user-picture/user-picture.repository";
import { UserPictureService } from "@/modules/user-picture/user-picture.service";
import { UserPictureEntity } from "@/modules/user-picture/user-picture.entity";
import { UserModule } from "@/modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([UserPictureEntity]), UserModule],
  controllers: [UserPictureController],
  providers: [UserPictureService, UserPictureRepository],
})
export class UserPictureModule {}
