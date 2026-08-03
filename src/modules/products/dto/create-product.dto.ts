import { IsProductVariantAttributes } from "@/common/decorators/is-product-attributes.decorator";
import { UploadImageDTO } from "@/modules/product-image/dto/upload-product-image.dto";
import type { ProductAttributes } from "@/common/types/product-attributes";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(10000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @IsNotEmpty()
  @Min(1)
  price: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  brand: string;

  @IsProductVariantAttributes()
  attributes: ProductAttributes[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  categories: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @Type(() => UploadImageDTO)
  images: UploadImageDTO[];
}
