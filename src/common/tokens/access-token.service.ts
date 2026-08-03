import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "@/modules/users/user.entity";
import { UserRepository } from "@/modules/users/user.repository";
import { LoggerService } from "@/common/logger/logger.service";
import { TokenPayload } from "@/common/tokens/token.payload";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async create(userId: string): Promise<string> {
    const payload: Omit<TokenPayload, "exp" | "iat"> = {
      sub: userId,
      type: "access",
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<number>("ACCESS_TOKEN_EXPIRES_IN"),
      secret: this.configService.getOrThrow("ACCESS_TOKEN_SECRET"),
    });

    return accessToken;
  }

  async isExpired(accessToken: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.getOrThrow("ACCESS_TOKEN_SECRET"),
      });
      return false;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return true;
      }

      throw new BadRequestException("Access token invalid.");
    }
  }

  getSubject(accessToken: string): TokenPayload {
    return this.jwtService.decode<TokenPayload>(accessToken);
  }

  async validate(req: Request, accessToken: string): Promise<UserEntity> {
    const payload = this.jwtService.verify<TokenPayload>(accessToken, {
      secret: this.configService.getOrThrow("ACCESS_TOKEN_SECRET"),
    });

    if (payload.type !== "access") {
      throw new BadRequestException("Your access token is invalid.");
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      this.logger.warn({
        message: "Authentication failed: user referenced by access token was not found.",
        path: req.path,
        class: AccessTokenService.name,
        method: this.validate.name,
        data: { userId: payload.sub },
      });

      throw new NotFoundException("User not found.");
    }

    return user;
  }
}
