import { RefreshEntity } from "@/modules/refreshes/entities/refresh.entity";
import { RefreshRepository } from "@/modules/refreshes/refresh.repository";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoggerService } from "@/common/logger/logger.service";
import { TokenPayload } from "@/common/tokens/token.payload";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { Request } from "express";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshRepository,
    private readonly bcryptService: BcryptService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async create(userId: string, oldRefreshId?: string): Promise<string> {
    const refreshTokenId = randomUUID();

    const payload: Omit<TokenPayload, "exp" | "iat"> = {
      sub: refreshTokenId,
      type: "refresh",
    };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<number>("REFRESH_TOKEN_EXPIRES_IN"),
      secret: this.configService.getOrThrow("REFRESH_TOKEN_SECRET"),
    });

    await this.createRefresh(userId, refreshTokenId, refreshToken, oldRefreshId);

    return refreshToken;
  }

  getSubject(refreshToken: string): TokenPayload {
    return this.jwtService.decode<TokenPayload>(refreshToken);
  }

  async validate(req: Request, refreshToken: string): Promise<RefreshEntity> {
    let payload: TokenPayload;

    try {
      payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow("REFRESH_TOKEN_SECRET"),
      });
    } catch (error) {
      this.logger.warn({
        message: "Authentication failed: Refresh token has expired.",
        path: req.path,
        class: RefreshTokenService.name,
        method: this.validate.name,
        error,
      });

      throw new UnauthorizedException("Your session has expired.");
    }

    if (payload.type !== "refresh") {
      throw new BadRequestException("Your session is invalid.");
    }

    const entity = await this.refreshTokenRepository.findById(payload.sub);

    if (!entity) {
      this.logger.warn({
        message: "Refresh failed: refresh token referenced by token was not found.",
        path: req.path,
        class: RefreshTokenService.name,
        method: this.validate.name,
        data: { userId: payload.sub },
      });

      throw new NotFoundException("Refresh token not found.");
    }

    if (entity.revokedAt !== null) {
      throw new UnauthorizedException("Your session has ended. Please log in again to continue.");
    }

    return entity;
  }

  private async createRefresh(
    userId: string,
    refreshTokenId: string,
    refreshToken: string,
    oldRefreshId?: string,
  ): Promise<void> {
    const refresh = new RefreshEntity();
    refresh.id = refreshTokenId;
    refresh.tokenHash = await this.bcryptService.hash(refreshToken);
    refresh.userId = userId;

    if (oldRefreshId) {
      refresh.replacedById = oldRefreshId;
      refresh.revokedAt = new Date();
    }

    await this.refreshTokenRepository.save(refresh);
  }

  async revoke(req: Request, refreshToken: string): Promise<void> {
    const { sub, type } = this.getSubject(refreshToken);

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

    const refresh = await this.refreshTokenRepository.findById(sub);

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

    await this.refreshTokenRepository.save(refresh);
  }
}
