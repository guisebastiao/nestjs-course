import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { PartialType, OmitType } from "@nestjs/mapped-types";

export class UpdateUserDTO extends OmitType(PartialType(CreateUserDTO), ["password"]) {}
