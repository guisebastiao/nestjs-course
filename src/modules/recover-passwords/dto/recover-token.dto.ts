import { IsNotEmpty, IsUUID } from "class-validator";

export class RecoverTokenDTO {
  @IsUUID()
  @IsNotEmpty()
  token: string;
}
