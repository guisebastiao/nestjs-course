import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

export class CreateProductAttributeDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;
}

export class CreateProductImageDTO {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1)
  price: number;

  @IsNumber()
  @Min(0)
  availableQuantity: number;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  category: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateProductAttributeDTO)
  attributes: CreateProductAttributeDTO[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateProductImageDTO)
  images: CreateProductImageDTO[];
}
