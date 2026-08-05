import { AddCartItemDTO } from "@/modules/cart-items/dto/add-cart-item.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";

export class UpdateCartItemDTO extends OmitType(PartialType(AddCartItemDTO), ["productId"]) {}
