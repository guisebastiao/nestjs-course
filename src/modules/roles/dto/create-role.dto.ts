import { IsNotEmpty, IsString, MaxLength, IsOptional } from "class-validator";
import { toScreamingSnakeCase } from "@/common/utils/screaming-snake-case";
import { Transform } from "class-transformer";

export class CreateRoleDTO {
  @Transform(({ value }) => toScreamingSnakeCase(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  description?: string;
}
