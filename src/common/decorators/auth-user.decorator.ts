import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestWithUser } from "@/common/types/request-with-user";
import { UserEntity } from "@/modules/users/user.entity";

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
