import { CreateUserDTO } from "@/modules/users/dto/create-user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
