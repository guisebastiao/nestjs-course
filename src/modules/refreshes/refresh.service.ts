import { RefreshTokenService } from "@/modules/tokens/refresh-token.service";
import { AccessTokenService } from "@/modules/tokens/access-token.service";
import { RefreshRepository } from "@/modules/refreshes/refresh.repository";
import { RefreshEntity } from "@/modules/refreshes/refresh.entity";
import { UserRepository } from "@/modules/users/user.repository";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoggerService } from "@/common/logger/logger.service";
import { AuthDTO } from "@/modules/auth/dto/auth.dto";
import { Request } from "express";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class RefreshService {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshRepository: RefreshRepository,
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

    const { sub: refreshSub } = this.refreshTokenService.validate(refreshToken);

    const oldRefreshToken = await this.refreshRepository.findById(refreshSub);

    if (!oldRefreshToken) {
      this.logger.warn({
        message: "Refresh failed: refresh token referenced by token was not found.",
        path: req.path,
        class: RefreshTokenService.name,
        method: this.refresh.name,
        data: { userId: refreshSub },
      });

      throw new NotFoundException("Refresh token not found.");
    }

    if (oldRefreshToken.revokedAt !== null) {
      this.logger.warn({
        message: "Refresh failed: refresh token is revoked.",
        path: req.path,
        class: RefreshTokenService.name,
        method: this.refresh.name,
        data: { userId: refreshSub },
      });

      throw new UnauthorizedException("Your session has ended. Please log in again to continue.");
    }

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

    const { sub: accessSub } = this.accessTokenService.getSubject(accessToken);

    const user = await this.userRepository.findById(accessSub);

    if (!user) {
      this.logger.warn({
        message: "Refresh failed: user referenced by access token was not found.",
        path: req.path,
        class: RefreshService.name,
        method: this.refresh.name,
        data: { userId: accessSub },
      });

      throw new NotFoundException("User not found.");
    }

    const newRefreshToken = await this.create(user.id, oldRefreshToken);
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

  async create(userId: string, oldRefreshToken?: RefreshEntity): Promise<string> {
    const { newRefreshToken, refreshTokenId } = await this.refreshTokenService.create();
    await this.createRefresh(userId, refreshTokenId, newRefreshToken, oldRefreshToken);
    return newRefreshToken;
  }

  async revoke(req: Request, refreshToken: string): Promise<void> {
    const { sub, type } = this.refreshTokenService.getSubject(refreshToken);

    if (type !== "refresh") {
      this.logger.warn({
        message: "Attempt to revoke a token that is not a refresh token.",
        path: req.path,
        class: RefreshTokenService.name,
        method: this.revoke.name,
        data: { sub },
      });

      throw new BadRequestException("Invalid token.");
    }

    const refresh = await this.refreshRepository.findById(sub);

    if (!refresh) {
      this.logger.warn({
        message: "Refresh token not found while attempting revocation.",
        path: req.path,
        class: RefreshTokenService.name,
        method: this.revoke.name,
        data: { sub },
      });

      throw new NotFoundException("Refresh token not found.");
    }

    refresh.revokedAt = new Date();

    await this.refreshRepository.save(refresh);

    this.logger.log({
      message: "Refresh token revoked successfully.",
      path: req.path,
      class: RefreshTokenService.name,
      method: this.revoke.name,
      data: { sub },
    });
  }

  private async createRefresh(
    userId: string,
    refreshTokenId: string,
    refreshToken: string,
    oldRefresh?: RefreshEntity,
  ): Promise<void> {
    const refresh = new RefreshEntity();
    refresh.id = refreshTokenId;
    refresh.tokenHash = await this.bcryptService.hash(refreshToken);
    refresh.userId = userId;

    if (oldRefresh) {
      refresh.replacedById = oldRefresh.id;
      oldRefresh.revokedAt = new Date();
      await this.refreshRepository.save(oldRefresh);
    }

    await this.refreshRepository.save(refresh);
  }
}
