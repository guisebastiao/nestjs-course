import { RefreshModule } from "@/modules/refreshes/refresh.module";
import { AuthController } from "@/modules/auth/auth.controller";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { AuthService } from "@/modules/auth/auth.service";
import { UserModule } from "@/modules/users/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UserModule, BcryptModule, RefreshModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
