import { RefreshTokenService } from "@/common/tokens/refresh-token.service";
import { AccessTokenService } from "@/common/tokens/access-token.service";
import { RefreshModule } from "@/modules/refreshes/refresh.module";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { UserModule } from "@/modules/users/user.module";
import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

const ISSUER = "NestJS-Course";

@Global()
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
