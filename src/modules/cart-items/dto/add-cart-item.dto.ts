import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsUUID } from "class-validator";

export class AddCartItemDTO {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  quantity: number;
}
