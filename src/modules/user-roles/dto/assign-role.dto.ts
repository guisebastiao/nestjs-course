import { IsNotEmpty, IsUUID } from "class-validator";

export class AssignRoleDTO {
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
