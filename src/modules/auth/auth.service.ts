import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { UserRepository } from "@/modules/users/user.repository";
import { LoggerService } from "@/common/logger/logger.service";
import { BcryptService } from "@/common/bcrypt/bcrypt.service";
import { LoginDto } from "@/modules/auth/dto/login.dto";
import { AuthDTO } from "@/modules/auth/dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async login(req: Request, dto: LoginDto): Promise<AuthDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    const isMatch = user ? await this.bcryptService.compare(dto.password, user.password) : false;

    if (!user || !isMatch) {
      this.sendLogger("Authentication failed: invalid email or password.", req, this.login.name, {
        email: dto.email,
      });

      throw new UnauthorizedException("Invalid email or passwords.");
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    this.logger.log({
      message: "User authenticated successfully.",
      class: AuthService.name,
      method: this.login.name,
      path: req.originalUrl,
      data: {
        userId: user.id,
        email: user.email,
      },
    });

    const data = new AuthDTO();
    data.accessToken = accessToken;

    return data;
  }

  async validateToken(req: Request, token: string): Promise<UserEntity> {
    try {
      const { sub } = this.jwtService.verify(token);

      const user = await this.userRepository.findById(sub);

      if (!user) {
        this.sendLogger(
          "Authentication failed: user referenced by token was not found.",
          req,
          this.validateToken.name,
          {
            userId: sub,
          },
        );

        throw new NotFoundException("User not found.");
      }

      return user;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.sendLogger("Authentication failed: token has expired.", req, this.validateToken.name);

        throw new UnauthorizedException("Your session has expired. Please log in again.");
      }

      if (error instanceof JsonWebTokenError) {
        this.sendLogger("Authentication failed: invalid JWT.", req, this.validateToken.name);

        throw new UnauthorizedException("Invalid authentication token.");
      }

      if (error instanceof NotBeforeError) {
        this.sendLogger(
          "Authentication failed: token is not active yet.",
          req,
          this.validateToken.name,
        );

        throw new UnauthorizedException("Authentication token is not yet valid.");
      }

      this.logger.error({
        message: "Unexpected error while validating JWT.",
        class: AuthService.name,
        method: this.validateToken.name,
        path: req.originalUrl,
        error,
      });

      throw new UnauthorizedException("It was not possible to authenticate your session.");
    }
  }

  private sendLogger(
    message: string,
    req: Request,
    method: string,
    data?: Record<string, unknown>,
  ): void {
    this.logger.warn({
      message,
      path: req.path,
      class: AuthService.name,
      method,
      data,
    });
  }
}
