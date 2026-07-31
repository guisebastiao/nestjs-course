import { DefaultRoleName } from "@/common/types/default-role-names";
import { SetMetadata } from "@nestjs/common";

export const HAS_ROLES_KEY = "hasRoles";

export const HasRoles = (...roles: DefaultRoleName[]) =>
  SetMetadata(HAS_ROLES_KEY, roles.length ? roles : [DefaultRoleName.USER]);
