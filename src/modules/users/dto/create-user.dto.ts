import { IsEmail, IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: "O nome não pode ser vazio" })
  @MaxLength(100, { message: "O nome precisa ter menos 100 caracteres" })
  name: string;

  @IsString()
  @IsNotEmpty({ message: "O email não pode ser vazio" })
  @IsEmail(undefined, { message: "O e-mail informado é inválido" })
  @MaxLength(255, { message: "O email precisa ter menos 255 caracteres" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "A senha não pode ser vazia" })
  @Length(6, 20, { message: "A senha precisa ter entre 6 a 20 caracteres" })
  password: string;
}
