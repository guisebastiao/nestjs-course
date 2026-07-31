import { CreateRoleDTO } from "@/modules/roles/dto/create-role.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";

export class UpdateRoleDTO extends OmitType(PartialType(CreateRoleDTO), ["name"]) {}
