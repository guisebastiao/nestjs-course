import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenService } from "@/modules/tokens/refresh-token.service";
import { AccessTokenService } from "@/modules/tokens/access-token.service";
import { UserRepository } from "@/modules/users/user.repository";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoggerService } from "@/common/logger/logger.service";
import { AuthDTO } from "@/modules/auth/dto/auth.dto";
import { Request } from "express";

@Injectable()
export class RefreshService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly logger: LoggerService,
  ) {}

  async refresh(req: Request, accessToken?: string, refreshToken?: string): Promise<AuthDTO> {
    if (!accessToken || !refreshToken) {
      this.logger.warn({
        message: "Refresh attempt without necessary cookies.",
        path: req.path,
        class: RefreshService.name,
        method: this.refresh.name,
      });

      throw new UnauthorizedException("You are missing necessary cookies.");
    }

    const isAccessTokenExpired = await this.accessTokenService.isExpired(accessToken);

    if (!isAccessTokenExpired) {
      return new AuthDTO(accessToken, refreshToken);
    }

    const oldRefreshToken = await this.refreshTokenService.validate(req, refreshToken);

    const isValid = await this.bcryptService.compare(refreshToken, oldRefreshToken.tokenHash);

    if (!isValid) {
      this.logger.warn({
        message: "Refresh failed: provided refresh token does not match the stored token hash.",
        path: req.path,
        class: RefreshService.name,
        method: this.refresh.name,
        data: {
          userId: oldRefreshToken.userId,
        },
      });

      throw new UnauthorizedException("Is invalid refresh token.");
    }

    const { sub } = this.accessTokenService.getSubject(accessToken);

    const user = await this.userRepository.findById(sub);

    if (!user) {
      this.logger.warn({
        message: "Refresh failed: user referenced by access token was not found.",
        path: req.path,
        class: RefreshService.name,
        method: this.refresh.name,
        data: { userId: sub },
      });

      throw new NotFoundException("User not found.");
    }

    const newRefreshToken = await this.refreshTokenService.create(user.id, oldRefreshToken);

    const newAccessToken = await this.accessTokenService.create(user.id);

    this.logger.log({
      message: "Tokens refreshed successfully.",
      path: req.path,
      class: RefreshService.name,
      method: this.refresh.name,
      data: {
        userId: user.id,
      },
    });

    return new AuthDTO(newAccessToken, newRefreshToken);
  }
}
