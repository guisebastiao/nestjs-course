import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RequestWithUser } from "@/common/types/request-with-user";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorator";
import { LoggerService } from "@/common/logger/logger.service";
import { AuthService } from "@/modules/auth/auth.service";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenHeader(request);

    if (!token) {
      this.logger.warn({
        message: "Attempt to access without an authentication token.",
        path: request.originalUrl,
        class: AuthGuard.name,
        method: this.canActivate.name,
      });

      throw new UnauthorizedException("Log in to continue.");
    }

    request.user = await this.authService.validateToken(request, token);

    return true;
  }

  private extractTokenHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
