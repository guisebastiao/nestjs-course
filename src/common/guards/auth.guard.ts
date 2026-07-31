import { UserRoleEntity } from "@/modules/user-roles/entities/user-role.entity";
import { AccessTokenService } from "@/common/tokens/access-token.service";
import { HAS_ROLES_KEY } from "@/common/decorators/has-roles.decorator";
import { DefaultRoleName } from "@/common/types/default-role-names";
import { RequestWithUser } from "@/common/types/request-with-user";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorator";
import { CookieService } from "@/common/cookies/cookie.service";
import { LoggerService } from "@/common/logger/logger.service";
import { CookieName } from "@/common/types/cookie-names";
import { Reflector } from "@nestjs/core";
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

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

    const roles = this.reflector.getAllAndOverride<DefaultRoleName[]>(HAS_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [DefaultRoleName.USER];

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

    const user = await this.accessTokenService.validate(request, accessToken);

    const userRoles = user.roles.map((userRole: UserRoleEntity) => userRole.role.name);

    const hasRole =
      userRoles.includes(DefaultRoleName.ADMIN) || roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      this.logger.warn({
        message: "User attempted to access a resource without the required role.",
        path: request.originalUrl,
        class: AuthGuard.name,
        method: this.canActivate.name,
        data: {
          userId: user.id,
          requiredRoles: roles,
          userRoles,
        },
      });

      throw new ForbiddenException("You do not have permission to access this resource.");
    }

    request.user = user;

    return true;
  }
}
