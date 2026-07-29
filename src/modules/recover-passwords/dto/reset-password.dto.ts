import { Match } from "@/common/decorators/match.decorator";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @Match("password")
  confirmPassword: string;
}
