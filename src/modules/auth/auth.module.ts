import { AuthController } from "@/modules/auth/auth.controller";
import { BcryptModule } from "@/common/bcrypt/bcrypt.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "@/modules/auth/auth.service";
import { UserModule } from "@/modules/users/user.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        global: true,
        secret: cfg.get("JWT_SECRET"),
        signOptions: {
          issuer: "nestjs-course",
          expiresIn: cfg.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
    UserModule,
    BcryptModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
