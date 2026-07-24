import { IsNotEmpty, IsEmail, MaxLength, Length } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
