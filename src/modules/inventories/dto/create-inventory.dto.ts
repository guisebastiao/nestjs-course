import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class CreateInventoryDTO {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantityAvailable: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  lowStockThreshold?: number;
}
