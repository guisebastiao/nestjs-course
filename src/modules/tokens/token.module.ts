import { RefreshTokenService } from "@/modules/tokens/refresh-token.service";
import { AccessTokenService } from "@/modules/tokens/access-token.service";
import { RefreshModule } from "@/modules/refreshes/refresh.module";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { UserModule } from "@/modules/users/user.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

const ISSUER = "NestJS-Course";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: {
        issuer: ISSUER,
      },
    }),
    RefreshModule,
    BcryptModule,
    UserModule,
  ],
  providers: [AccessTokenService, RefreshTokenService],
  exports: [AccessTokenService, RefreshTokenService],
})
export class TokenModule {}
