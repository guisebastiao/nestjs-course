import { BadRequestException, Injectable } from "@nestjs/common";
import { TokenPayload } from "@/modules/tokens/token.payload";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getSubject(refreshToken: string): TokenPayload {
    return this.jwtService.decode<TokenPayload>(refreshToken);
  }

  async create(): Promise<{ newRefreshToken: string; refreshTokenId: string }> {
    const refreshTokenId = randomUUID();

    const payload: Omit<TokenPayload, "exp" | "iat"> = {
      sub: refreshTokenId,
      type: "refresh",
    };

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.getOrThrow<number>("REFRESH_TOKEN_EXPIRES_IN"),
      secret: this.configService.getOrThrow("REFRESH_TOKEN_SECRET"),
    });

    return { newRefreshToken, refreshTokenId };
  }

  validate(refreshToken: string): TokenPayload {
    const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
      secret: this.configService.getOrThrow("REFRESH_TOKEN_SECRET"),
    });

    if (payload.type !== "refresh") {
      throw new BadRequestException("Your session is invalid.");
    }

    return payload;
  }
}
