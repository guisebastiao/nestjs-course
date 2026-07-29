import { IsString, IsNotEmpty, IsEmail, MaxLength } from "class-validator";

export class CreateRecoverPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;
}
