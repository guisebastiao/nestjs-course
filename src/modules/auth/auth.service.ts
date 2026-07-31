import { RefreshTokenService } from "@/common/tokens/refresh-token.service";
import { AccessTokenService } from "@/common/tokens/access-token.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "@/modules/users/user.repository";
import { LoggerService } from "@/common/logger/logger.service";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import { AuthDTO } from "@/modules/auth/dto/auth.dto";
import { Request } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly logger: LoggerService,
  ) {}

  async login(req: Request, dto: LoginDto): Promise<AuthDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    const isMatch = user ? await this.bcryptService.compare(dto.password, user.password) : false;

    if (!user || !isMatch) {
      this.logger.warn({
        message: "Authentication failed: invalid email or password.",
        path: req.path,
        class: AuthService.name,
        method: this.login.name,
        data: {
          email: dto.email,
        },
      });

      throw new UnauthorizedException("Invalid email or passwords.");
    }

    const refreshToken = await this.refreshTokenService.create(user.id);
    const accessToken = await this.accessTokenService.create(user.id);

    this.logger.log({
      message: "User authenticated successfully.",
      class: AuthService.name,
      method: this.login.name,
      path: req.path,
      data: {
        userId: user.id,
        email: user.email,
      },
    });

    return new AuthDTO(accessToken, refreshToken);
  }

  async logout(req: Request, refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      this.logger.warn({
        message: "Logout attempt without refresh token cookie.",
        class: AuthService.name,
        method: this.logout.name,
        path: req.path,
      });

      throw new UnauthorizedException("You are missing necessary cookie.");
    }

    await this.refreshTokenService.revoke(req, refreshToken);

    this.logger.log({
      message: "User logged out successfully.",
      class: AuthService.name,
      method: this.logout.name,
      path: req.path,
    });
  }
}
