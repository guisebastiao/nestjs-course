import { ArrayUnique, IsArray, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { UploadImageDTO } from "@/modules/product-image/dto/upload-product-image.dto";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";

export class UpdateProductDTO extends OmitType(PartialType(CreateProductDTO), ["images"]) {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  deleteImages?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadImageDTO)
  newImages?: UploadImageDTO[];
}
