import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenService } from "@/common/tokens/refresh-token.service";
import { AccessTokenService } from "@/common/tokens/access-token.service";
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
      throw new UnauthorizedException("You are missing necessary cookies.");
    }

    const isAccessTokenExpired = await this.accessTokenService.isExpired(accessToken);

    if (!isAccessTokenExpired) {
      return new AuthDTO(accessToken, refreshToken);
    }

    const oldRefreshToken = await this.refreshTokenService.validate(req, refreshToken);

    const isValid = await this.bcryptService.compare(refreshToken, oldRefreshToken.tokenHash);

    if (!isValid) {
      throw new UnauthorizedException("Is invalid refresh token.");
    }

    const { sub } = this.accessTokenService.getSubject(accessToken);

    const user = await this.userRepository.findById(sub);

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const newRefreshToken = await this.refreshTokenService.create(user, oldRefreshToken);

    const newAccessToken = await this.accessTokenService.create(user.id);

    return new AuthDTO(newAccessToken, newRefreshToken);
  }
}
