import { Type } from "class-transformer";
import {
  IsUUID,
  IsArray,
  Min,
  ArrayMinSize,
  ValidateNested,
  IsInt,
  IsNotEmpty,
} from "class-validator";

export class CreateItemOrderDTO {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDTO {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemOrderDTO)
  items: CreateItemOrderDTO[];
}
