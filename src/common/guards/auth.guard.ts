import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccessTokenService } from "@/common/tokens/access-token.service";
import { RequestWithUser } from "@/common/types/request-with-user";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorator";
import { CookieService } from "@/common/cookies/cookie.service";
import { LoggerService } from "@/common/logger/logger.service";
import { CookieName } from "@/common/types/cookie-names";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly cookieService: CookieService,
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

    const accessToken = this.cookieService.get(request, CookieName.ACCESS_TOKEN);

    if (!accessToken) {
      this.logger.warn({
        message: "Attempt to access without an authentication token.",
        path: request.originalUrl,
        class: AuthGuard.name,
        method: this.canActivate.name,
      });

      throw new UnauthorizedException("Log in to continue.");
    }

    request.user = await this.accessTokenService.validate(request, accessToken);

    return true;
  }
}
