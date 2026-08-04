import { UploadImageDTO } from "@/modules/product-image/dto/upload-product-image.dto";
import { UpdateInventoryDTO } from "@/modules/inventories/dto/update-inventory.dto";
import { CreateProductDTO } from "@/modules/products/dto/create-product.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class UpdateProductDTO extends OmitType(PartialType(CreateProductDTO), [
  "images",
  "inventory",
]) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateInventoryDTO)
  inventory: UpdateInventoryDTO;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  deleteImages?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @Type(() => UploadImageDTO)
  newImages?: UploadImageDTO[];
}
