import { RefreshRepository } from "@/modules/refreshes/refresh.repository";
import { RefreshController } from "@/modules/refreshes/refresh.controller";
import { RefreshService } from "@/modules/refreshes/refresh.service";
import { RefreshEntity } from "@/modules/refreshes/refresh.entity";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { TokenModule } from "@/modules/tokens/token.module";
import { UserModule } from "@/modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshEntity]), UserModule, BcryptModule, TokenModule],
  controllers: [RefreshController],
  providers: [RefreshService, RefreshRepository],
  exports: [RefreshRepository],
})
export class RefreshModule {}
