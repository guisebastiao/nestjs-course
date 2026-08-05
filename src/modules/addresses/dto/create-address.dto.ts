import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateAddressDTO {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  label?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d+|s\/n)$/i, {
    message: "number must contain only digits or 'S/N'",
  })
  number: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  state: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  country: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  complement?: string;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean = false;
}
