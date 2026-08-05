import { RefreshTokenService } from "@/modules/tokens/refresh-token.service";
import { AccessTokenService } from "@/modules/tokens/access-token.service";
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
    BcryptModule,
    UserModule,
  ],
  providers: [AccessTokenService, RefreshTokenService],
  exports: [AccessTokenService, RefreshTokenService],
})
export class TokenModule {}
